import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { getLanguageCookie, setLanguageCookie } from '../../utils/cookie-utils';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', dir: 'ltr' },
  { code: 'fr', dir: 'ltr' },
  { code: 'ar', dir: 'rtl' },
] as const;

interface DirectionLayoutProps {
  children: React.ReactNode;
}

const DirectionLayout: React.FC<DirectionLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Check for saved language preference
      const savedLocale = getLanguageCookie();
      if (savedLocale && savedLocale !== router.locale) {
        const currentPath = router.pathname;
        const query = router.query;
        router.replace({ pathname: currentPath, query }, router.asPath, { locale: savedLocale });
        return;
      }
    }

    // Set current language if no saved preference
    const currentLang = languages.find(lang => lang.code === router.locale) || languages[0];
    
    // Only update cookie if language has changed
    const savedLocale = getLanguageCookie();
    if (currentLang.code !== savedLocale) {
      setLanguageCookie(currentLang.code);
    }

    // Sync i18next instance with Next.js locale
    if (i18n.language !== currentLang.code) {
      i18n.changeLanguage(currentLang.code);
    }

    // Set direction and language attributes
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
    
    // Add/remove RTL class from body
    const isRTL = currentLang.dir === 'rtl';
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Cleanup function
    return () => {
      if (!router.pathname.startsWith('/login')) {
        document.body.classList.remove('rtl', 'ltr');
      }
    };
  }, [router.locale, router.pathname, router.asPath, i18n, mounted]);

  const currentLang = languages.find(lang => lang.code === router.locale) || languages[0];
  const isRTL = currentLang.dir === 'rtl';

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <div 
      className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} 
      dir={currentLang.dir} 
      lang={currentLang.code}
      data-language={currentLang.code}
    >
      {children}
    </div>
  );
};

export default DirectionLayout; 