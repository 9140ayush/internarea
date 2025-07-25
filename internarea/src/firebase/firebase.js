// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // Your web app's Firebase configuration

// const firebaseConfig = {
//   apiKey: "AIzaSyDbYTYs_oSK2rvtzHxBCPFrqdXM-l7MokQ",
//   authDomain: "internshala-9e300.firebaseapp.com",
//   projectId: "internshala-9e300",
//   storageBucket: "internshala-9e300.firebasestorage.app",
//   messagingSenderId: "304425115290",
//   appId: "1:304425115290:web:1b0653f1acd4192b848923",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// export { auth, provider };

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCECtHULqov7ljfC4Fe6Hz0mhjHF-2Gc9w",
  authDomain: "internshala-91.firebaseapp.com",
  projectId: "internshala-91",
  storageBucket: "internshala-91.firebasestorage.app",
  messagingSenderId: "692643297994",
  appId: "1:692643297994:web:c7a72e396c8abe97ca9233",
  measurementId: "G-77RME2BSWT"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
