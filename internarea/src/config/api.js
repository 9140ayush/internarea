// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://internarea-h88w.onrender.com'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  // User endpoints
  USER_SYNC: `${API_BASE_URL}/api/user/sync`,
  USER_PROFILE: `${API_BASE_URL}/api/user`,
  
  // Avatar endpoints
  AVATAR_PROFILE: `${API_BASE_URL}/api/avatar/profile`,
  AVATAR_UPLOAD: `${API_BASE_URL}/api/avatar/upload`,
  AVATAR_GENERATE: `${API_BASE_URL}/api/avatar/generate-dicebear`,
  AVATAR_DELETE: `${API_BASE_URL}/api/avatar/profile-image`,
};

export default API_BASE_URL; 