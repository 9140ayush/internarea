import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Globe, Mail, Lock, X, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFrenchModal, setShowFrenchModal] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Proper hook usage at component level
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're on client-side
  if (!isClient) {
    return (
      <div className={`${className} flex items-center space-x-2 px-3 py-2 text-gray-700 rounded-md`}>
        <Globe className="w-4 h-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  // Safely access i18n properties with optional chaining
  const currentLanguage = i18n?.language || 'en';
  const availableLanguages = i18n?.languages || ['en'];

  const languages = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
    { code: 'hi', name: t('language.hindi'), flag: '🇮🇳' },
    { code: 'pt', name: t('language.portuguese'), flag: '🇧🇷' },
    { code: 'zh', name: t('language.chinese'), flag: '🇨🇳' },
    { code: 'fr', name: t('language.french'), flag: '🇫🇷' },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === 'fr') {
      // Show French OTP modal
      setShowFrenchModal(true);
      setIsOpen(false);
    } else {
      // Change language immediately for other languages
      if (i18n) {
        i18n.changeLanguage(languageCode);
        // Safely set localStorage
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('i18nextLng', languageCode);
          }
        } catch (error) {
          console.warn('Failed to save language preference to localStorage:', error);
        }
      }
      setIsOpen(false);
      toast.success(`${languages.find(lang => lang.code === languageCode)?.name} ${t('common.success')}`);
    }
  };

  const sendFrenchOTP = async () => {
    if (!email) {
      toast.error(t('language.enterEmail'));
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(API_ENDPOINTS.LANGUAGE_SEND_OTP, { email });
      setIsOtpSent(true);
      toast.success(t('language.otpSent'));
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyFrenchOTP = async () => {
    if (!otp) {
      toast.error(t('language.verifyOtp'));
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(API_ENDPOINTS.LANGUAGE_VERIFY_OTP, { email, otp });
      
      // Activate French language
      if (i18n) {
        i18n.changeLanguage('fr');
        // Safely set localStorage
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('i18nextLng', 'fr');
          }
        } catch (error) {
          console.warn('Failed to save language preference to localStorage:', error);
        }
      }
      
      setShowFrenchModal(false);
      setEmail('');
      setOtp('');
      setIsOtpSent(false);
      
      toast.success(t('language.frenchActivated'));
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('language.otpVerificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLanguage = () => {
    const currentLang = languages.find(lang => lang.code === currentLanguage);
    return currentLang || languages[0];
  };

  return (
    <>
      {/* Language Selector */}
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{getCurrentLanguage().flag} {getCurrentLanguage().name}</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* French OTP Modal */}
      {showFrenchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('language.frenchOtpTitle')}</h3>
              <button
                onClick={() => setShowFrenchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">{t('language.frenchOtpMessage')}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('language.enterEmail')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isOtpSent}
                />
              </div>

              {!isOtpSent ? (
                <button
                  onClick={sendFrenchOTP}
                  disabled={!email || isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isLoading ? 'Sending...' : t('language.sendOtpForFrench')}</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('language.verifyOtp')}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={verifyFrenchOTP}
                    disabled={!otp || isLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isLoading ? 'Verifying...' : t('language.verifyOtp')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector; 