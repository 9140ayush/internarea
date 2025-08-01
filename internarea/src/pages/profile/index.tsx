import { selectuser } from "@/Feature/Userslice";
import { ExternalLink, Mail, User, Edit3, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AvatarUpload from "@/Components/AvatarUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/config/api";

interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  profileImage?: string;
  displayImage?: string;
  avatarType?: string;
  firebaseUid?: string;
}

const ProfilePage = () => {
  const reduxUser = useSelector(selectuser);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const headers: any = {};
    
    if (reduxUser?.firebaseUid) {
      headers['x-firebase-uid'] = reduxUser.firebaseUid;
    } else if (reduxUser?.id) {
      headers['x-user-id'] = reduxUser.id;
    }
    
    return headers;
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
             const response = await axios.get(API_ENDPOINTS.AVATAR_PROFILE, {
         headers: getAuthHeaders()
       });

      if (response.data.success) {
        setUser(response.data.user);
        setEditForm({
          name: response.data.user.name,
          email: response.data.user.email
        });
      }
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      // Fallback to Redux user data
      if (reduxUser) {
        setUser({
          _id: reduxUser.id || 'demo-user',
          name: reduxUser.name,
          email: reduxUser.email,
          photoURL: reduxUser.photo,
          displayImage: reduxUser.photo,
          firebaseUid: reduxUser.firebaseUid
        });
        setEditForm({
          name: reduxUser.name,
          email: reduxUser.email
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      setIsSaving(true);
             const response = await axios.put(API_ENDPOINTS.AVATAR_PROFILE, editForm, {
         headers: {
           ...getAuthHeaders(),
           'Content-Type': 'application/json'
         }
       });

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar change
  const handleAvatarChange = (newAvatar: string) => {
    if (user) {
      setUser({
        ...user,
        displayImage: newAvatar
      });
    }
  };

  // Handle profile update from avatar component
  const handleProfileUpdateFromAvatar = (userData: any) => {
    setUser(userData);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {user.displayImage ? (
                <img
                  src={user.displayImage}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-6">
            {/* Profile Info Section */}
            <div className="text-center mb-8">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                <AvatarUpload
                  currentAvatar={user.displayImage}
                  onAvatarChange={handleAvatarChange}
                  onProfileUpdate={handleProfileUpdateFromAvatar}
                  firebaseUid={user.firebaseUid}
                  userId={user._id}
                />
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-blue-600 text-sm mt-1">
                    Active Applications
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <span className="text-green-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-green-600 text-sm mt-1">
                    Accepted Applications
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <span className="text-purple-600 font-semibold text-2xl">
                    {user.avatarType || 'google'}
                  </span>
                  <p className="text-purple-600 text-sm mt-1">
                    Avatar Type
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/userapplication"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View Applications
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
                
                <Link
                  href="/avatar-demo"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Avatar Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
