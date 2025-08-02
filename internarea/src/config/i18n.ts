import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import hiTranslations from '../locales/hi.json';
import ptTranslations from '../locales/pt.json';
import zhTranslations from '../locales/zh.json';
import frTranslations from '../locales/fr.json';

const resources = {
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  hi: {
    translation: hiTranslations
  },
  pt: {
    translation: ptTranslations
  },
  zh: {
    translation: zhTranslations
  },
  fr: {
    translation: frTranslations
  }
};

// Initialize i18n only once
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },
      
      // Ensure proper initialization
      react: {
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
      },
      
      // Load resources synchronously to prevent hydration issues
      load: 'languageOnly',
      preload: ['en', 'es', 'hi', 'pt', 'zh', 'fr'],
    });
}

export default i18n; 