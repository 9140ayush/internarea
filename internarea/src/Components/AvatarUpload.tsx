import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, User, Edit3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '@/config/api';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  onProfileUpdate?: (userData: any) => void;
  firebaseUid?: string;
  userId?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  onAvatarChange,
  onProfileUpdate,
  firebaseUid,
  userId
}) => {
  const [avatar, setAvatar] = useState<string>(currentAvatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDiceBearModal, setShowDiceBearModal] = useState(false);
  const [diceBearSeed, setDiceBearSeed] = useState('');
  const [diceBearStyle, setDiceBearStyle] = useState('avataaars');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const diceBearStyles = [
    { value: 'avataaars', label: 'Avataaars' },
    { value: 'bottts', label: 'Bottts' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'identicon', label: 'Identicon' },
    { value: 'initials', label: 'Initials' },
    { value: 'personas', label: 'Personas' }
  ];

  useEffect(() => {
    if (currentAvatar) {
      setAvatar(currentAvatar);
    }
  }, [currentAvatar]);

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (firebaseUid) {
      headers['x-firebase-uid'] = firebaseUid;
    } else if (userId) {
      headers['x-user-id'] = userId;
    }
    
    return headers;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

         try {
       const response = await axios.post(API_ENDPOINTS.AVATAR_UPLOAD, formData, {
         headers: getAuthHeaders(),
       });

      if (response.data.success) {
        setAvatar(response.data.displayImage);
        onAvatarChange(response.data.displayImage);
        // Call onProfileUpdate with user data if available, otherwise just trigger a re-fetch
        if (response.data.user) {
          onProfileUpdate?.(response.data.user);
        } else {
          onProfileUpdate?.();
        }
        toast.success('Profile image uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const generateDiceBearAvatar = async () => {
    if (!diceBearSeed.trim()) {
      toast.error('Please enter a seed for the avatar');
      return;
    }

    setIsGenerating(true);
         try {
       const response = await axios.post(API_ENDPOINTS.AVATAR_GENERATE, {
         seed: diceBearSeed,
         style: diceBearStyle
       }, {
         headers: {
           ...getAuthHeaders(),
           'Content-Type': 'application/json'
         }
       });

      if (response.data.success) {
        setAvatar(response.data.displayImage);
        onAvatarChange(response.data.displayImage);
        // Call onProfileUpdate with user data if available, otherwise just trigger a re-fetch
        if (response.data.user) {
          onProfileUpdate?.(response.data.user);
        } else {
          onProfileUpdate?.();
        }
        setShowDiceBearModal(false);
        toast.success('Avatar generated successfully!');
      }
    } catch (error: any) {
      console.error('DiceBear generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate avatar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveAvatar = async () => {
         try {
       const response = await axios.delete(API_ENDPOINTS.AVATAR_DELETE, {
         headers: getAuthHeaders()
       });

      if (response.data.success) {
        setAvatar(response.data.displayImage);
        onAvatarChange(response.data.displayImage);
        // Call onProfileUpdate with user data if available, otherwise just trigger a re-fetch
        if (response.data.user) {
          onProfileUpdate?.(response.data.user);
        } else {
          onProfileUpdate?.();
        }
        toast.success('Profile image removed successfully!');
      }
    } catch (error: any) {
      console.error('Remove avatar error:', error);
      toast.error(error.response?.data?.error || 'Failed to remove avatar. Please try again.');
    }
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    setDiceBearSeed(randomSeed);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <User className="h-16 w-16 text-gray-400" />
            )}
            {!avatar && <User className="h-16 w-16 text-gray-400" />}
          </div>
          
          {/* Upload Progress Overlay */}
          {(isUploading || isGenerating) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
          )}

          {/* Edit Icon Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200">
            <Edit3 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* Avatar Actions */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </button>

          <button
            onClick={() => setShowDiceBearModal(true)}
            disabled={isUploading || isGenerating}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Camera className="h-4 w-4 mr-2" />
            Generate Avatar
          </button>

          {avatar && (
            <button
              onClick={handleRemoveAvatar}
              disabled={isUploading || isGenerating}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* DiceBear Modal */}
      {showDiceBearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate DiceBear Avatar</h3>
              <button
                onClick={() => setShowDiceBearModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Style
                </label>
                <select
                  value={diceBearStyle}
                  onChange={(e) => setDiceBearStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {diceBearStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seed Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed (unique identifier)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={diceBearSeed}
                    onChange={(e) => setDiceBearSeed(e.target.value)}
                    placeholder="Enter a seed or generate random"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={generateRandomSeed}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Random
                  </button>
                </div>
              </div>

              {/* Preview */}
              {diceBearSeed && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={`https://api.dicebear.com/7.x/${diceBearStyle}/svg?seed=${diceBearSeed}`}
                    alt="Avatar Preview"
                    className="w-24 h-24 mx-auto rounded-full border-2 border-gray-200"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={generateDiceBearAvatar}
                  disabled={!diceBearSeed.trim() || isGenerating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Avatar'
                  )}
                </button>
                <button
                  onClick={() => setShowDiceBearModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload; 