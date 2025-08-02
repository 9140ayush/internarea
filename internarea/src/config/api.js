// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://internarea-h88w.onrender.com')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://internarea-h88w.onrender.com');

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // User endpoints
  USER_SYNC: `${API_BASE_URL}/api/user/sync`,
  USER_PROFILE: `${API_BASE_URL}/api/user`,
  
  // Avatar endpoints
  AVATAR_PROFILE: `${API_BASE_URL}/api/avatar/profile`,
  AVATAR_UPLOAD: `${API_BASE_URL}/api/avatar/upload`,
  AVATAR_GENERATE: `${API_BASE_URL}/api/avatar/generate-dicebear`,
  AVATAR_DELETE: `${API_BASE_URL}/api/avatar/profile-image`,
  
  // Video Resume endpoints
  VIDEO_RESUME_SEND_OTP: `${API_BASE_URL}/api/video-resume/send-otp`,
  VIDEO_RESUME_UPLOAD: `${API_BASE_URL}/api/video-resume/upload`,
  VIDEO_RESUME_USER: `${API_BASE_URL}/api/video-resume/user`,
  VIDEO_RESUME_DELETE: `${API_BASE_URL}/api/video-resume`,
  
  // Language OTP endpoints
  LANGUAGE_SEND_OTP: `${API_BASE_URL}/api/video-resume/language/send-otp`,
  LANGUAGE_VERIFY_OTP: `${API_BASE_URL}/api/video-resume/language/verify-otp`,
  
  // Internship endpoints
  INTERNSHIPS: `${API_BASE_URL}/api/internship`,
  INTERNSHIP_BY_ID: (id) => `${API_BASE_URL}/api/internship/${id}`,
  
  // Job endpoints
  JOBS: `${API_BASE_URL}/api/job`,
  JOB_BY_ID: (id) => `${API_BASE_URL}/api/job/${id}`,
  
  // Application endpoints
  APPLICATIONS: `${API_BASE_URL}/api/application`,
  APPLICATION_BY_ID: (id) => `${API_BASE_URL}/api/application/${id}`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/adminlogin`,
};

export default API_BASE_URL; 