import Footer from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";
import { useRouter } from "next/router";
// Import i18n configuration at the top level
import "@/config/i18n";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function AuthListener() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    useEffect(() => {
      auth.onAuthStateChanged(async (authuser) => {
        if (authuser) {
          const userData = {
            uid: authuser.uid,
            photo: authuser.photoURL,
            name: authuser.displayName,
            email: authuser.email,
            phoneNumber: authuser.phoneNumber,
          };
          
          dispatch(login(userData));
          
          // Sync user data with MongoDB - only in production or when backend is available
          if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_API_URL) {
            try {
              const response = await axios.post(API_ENDPOINTS.USER_SYNC, {
                firebaseUid: authuser.uid,
                name: authuser.displayName,
                email: authuser.email,
                photoURL: authuser.photoURL
              }, {
                timeout: 10000, // 10 second timeout
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              // User data synced successfully
            } catch (error: any) {
              // Failed to sync user data - handled silently
              // Don't show error to user as this is a background sync
              // Only log for debugging purposes
            }
          }
        } else {
          dispatch(logout());
        }
      });
    }, [dispatch]);
    return null;
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <AuthListener />
      <div className="bg-white">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Provider>
  );
}
