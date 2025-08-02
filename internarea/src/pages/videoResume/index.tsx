import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment-timezone';
import { Upload, Clock, AlertCircle, CheckCircle, X, Video, Mail, Lock } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { useTranslation } from 'react-i18next';

interface VideoResume {
  id: string;
  fileName: string;
  duration: number;
  fileSize: number;
  fileUrl: string;
  uploadTime: string;
}

const VideoResumeUpload: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoResumes, setVideoResumes] = useState<VideoResume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Proper hook usage at component level
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're on client-side
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



  // Check if current time is within upload window (2 PM to 7 PM IST)
  const isWithinUploadTime = () => {
    const istTime = moment().tz('Asia/Kolkata');
    const hour = istTime.hour();
    return hour >= 14 && hour < 19;
  };

  const getCurrentISTTime = () => {
    return moment().tz('Asia/Kolkata').format('h:mm A');
  };

  const getUploadWindowStatus = () => {
    const istTime = moment().tz('Asia/Kolkata');
    const hour = istTime.hour();
    
    if (hour < 14) {
      const timeUntilStart = moment().tz('Asia/Kolkata').startOf('day').add(14, 'hours').diff(moment(), 'minutes');
      return { status: 'waiting', message: `${t('videoResume.uploadWindowWaiting')} ${Math.floor(timeUntilStart / 60)}h ${timeUntilStart % 60}m` };
    } else if (hour >= 19) {
      return { status: 'closed', message: t('videoResume.uploadWindowClosed') };
    } else {
      const timeUntilEnd = moment().tz('Asia/Kolkata').startOf('day').add(19, 'hours').diff(moment(), 'minutes');
      return { status: 'open', message: `${t('videoResume.uploadWindowOpen')} ${Math.floor(timeUntilEnd / 60)}h ${timeUntilEnd % 60}m` };
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      if (file.type !== 'video/mp4') {
        toast.error(t('videoResume.fileTypeError'));
        return;
      }

      // Validate file size (100MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 100) {
        toast.error(t('videoResume.fileSizeError'));
        return;
      }

      setSelectedFile(file);
      toast.success(t('videoResume.fileSelected'));
    }
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4']
    },
    multiple: false
  });

  const sendOTP = async () => {
    if (!email) {
      toast.error(t('videoResume.emailPlaceholder'));
      return;
    }

    if (!isWithinUploadTime()) {
      toast.error(t('videoResume.timeRestriction'));
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(API_ENDPOINTS.VIDEO_RESUME_SEND_OTP, {
        email
      });

      setIsOtpSent(true);
      toast.success(t('videoResume.otpSent'));
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('videoResume.otpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async () => {
    if (!selectedFile || !email || !otp) {
      toast.error(t('common.error'));
      return;
    }

    if (!isWithinUploadTime()) {
      toast.error(t('videoResume.timeRestriction'));
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('email', email);
      formData.append('otp', otp);
      formData.append('userId', email); // Using email as user identifier

      const response = await axios.post(API_ENDPOINTS.VIDEO_RESUME_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      toast.success(t('videoResume.uploadSuccess'));
      setSelectedFile(null);
      setEmail('');
      setOtp('');
      setIsOtpSent(false);
      setUploadProgress(0);
      
      // Refresh video resumes list
      fetchVideoResumes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('videoResume.uploadFailed'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fetchVideoResumes = async () => {
    try {
      if (email) {
        const response = await axios.get(`${API_ENDPOINTS.VIDEO_RESUME_USER}/${encodeURIComponent(email)}`);
        setVideoResumes(response.data.videoResumes);
      }
    } catch (error) {
      console.error('Error fetching video resumes:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const uploadWindowStatus = getUploadWindowStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('videoResume.title')}</h1>
            <p className="text-gray-600">{t('videoResume.subtitle')}</p>
          </div>

          {/* Upload Time Status */}
          <div className={`mb-6 p-4 rounded-lg border ${
            uploadWindowStatus.status === 'open' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              <Clock className={`w-5 h-5 ${
                uploadWindowStatus.status === 'open' ? 'text-green-600' : 'text-yellow-600'
              }`} />
              <span className={`font-medium ${
                uploadWindowStatus.status === 'open' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {uploadWindowStatus.message}
              </span>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              {t('videoResume.currentTime')}: {getCurrentISTTime()}
            </div>
          </div>

          {/* Email and OTP Section */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('videoResume.emailLabel')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('videoResume.emailPlaceholder')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isOtpSent}
                  />
                  <button
                    onClick={sendOTP}
                    disabled={!email || isLoading || !isWithinUploadTime()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isLoading ? t('videoResume.sendingOtp') : t('videoResume.sendOtp')}</span>
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('videoResume.otpLabel')}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={t('videoResume.otpPlaceholder')}
                      maxLength={6}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtp('');
                      }}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('videoResume.videoFileLabel')}
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Size: {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragActive ? t('videoResume.dragDropActive') : t('videoResume.dragDropText')}
                  </p>
                  <p className="text-sm text-gray-500">{t('videoResume.clickToSelect')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{t('videoResume.uploading')}</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="text-center">
            <button
              onClick={uploadVideo}
              disabled={!selectedFile || !email || !otp || isUploading || !isWithinUploadTime()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
            >
              <Video className="w-5 h-5" />
              <span>{isUploading ? t('videoResume.uploading') : t('videoResume.uploadVideoResume')}</span>
            </button>
          </div>

          {/* Uploaded Videos */}
          {videoResumes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('videoResume.yourVideoResumes')}</h2>
              <div className="space-y-4">
                {videoResumes.map((resume) => (
                  <div key={resume.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Video className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                          <p className="text-sm text-gray-500">
                            {t('videoResume.duration')}: {formatDuration(resume.duration)} | 
                            {t('videoResume.size')}: {formatFileSize(resume.fileSize)} | 
                            {t('videoResume.uploaded')}: {moment(resume.uploadTime).format('MMM DD, YYYY h:mm A')}
                          </p>
                        </div>
                      </div>
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">{t('videoResume.importantNotes')}</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>{t('videoResume.notes.timeRestriction')}</li>
                  <li>{t('videoResume.notes.fileType')}</li>
                  <li>{t('videoResume.notes.fileSize')}</li>
                  <li>{t('videoResume.notes.duration')}</li>
                  <li>{t('videoResume.notes.otpExpiry')}</li>
                  <li>{t('videoResume.notes.otpUsage')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResumeUpload; 