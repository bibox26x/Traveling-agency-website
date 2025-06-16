import i18n from 'i18next';
import { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getLanguageCookie } from './utils/cookie-utils';

// Define supported languages
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;

const i18nInstance = i18n.createInstance();

const initOptions: InitOptions = {
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['cookie', 'localStorage', 'sessionStorage', 'navigator', 'path'],
    lookupCookie: 'NEXT_LOCALE',
    lookupLocalStorage: 'NEXT_LOCALE',
    lookupSessionStorage: 'NEXT_LOCALE',
    caches: ['cookie', 'localStorage'],
    cookieMinutes: 365 * 24 * 60, // 1 year
  },
  react: {
    useSuspense: false,
  },
  // Critical: ensure resources are loaded before rendering
  initImmediate: false,
  // Add load namespace on init to ensure translations are available immediately
  load: 'currentOnly',
  preload: SUPPORTED_LANGUAGES,
};

i18nInstance
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`./public/locales/${language}/${namespace}.json`)
  ))
  .init(initOptions);

// Set initial language from cookie if available
if (typeof window !== 'undefined') {
  const initialLang = getLanguageCookie();
  if (initialLang && SUPPORTED_LANGUAGES.includes(initialLang as typeof SUPPORTED_LANGUAGES[number])) {
    i18nInstance.changeLanguage(initialLang);
  }
}

export default i18nInstance; 