import { getCookie } from 'cookies-next';

export const getInitialLocale = (): string => {
  // Check for the NEXT_LOCALE cookie
  const localeCookie = getCookie('NEXT_LOCALE');
  if (typeof localeCookie === 'string') {
    return localeCookie;
  }

  // Check for browser language
  if (typeof window !== 'undefined') {
    const browserLang = window.navigator.language.split('-')[0];
    if (['en', 'fr', 'ar'].includes(browserLang)) {
      return browserLang;
    }
  }

  // Default to English
  return 'en';
}; 