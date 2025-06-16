import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface UseLocalizationReturn {
  t: (key: string, options?: any) => string;
  isRTL: boolean;
  currentLocale: string;
  currentDir: 'ltr' | 'rtl';
  isLoading: boolean;
  changeLocale: (locale: string) => Promise<void>;
}

export const useLocalization = (): UseLocalizationReturn => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentDir, setCurrentDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Set initial direction based on current locale
    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';
    setCurrentDir(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = router.locale || 'en';
  }, [router.locale]);

  const changeLocale = async (locale: string) => {
    if (isLoading || locale === router.locale) return;

    setIsLoading(true);
    try {
      const dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = locale;
      setCurrentDir(dir);

      // Update body class for RTL styling
      if (dir === 'rtl') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }

      // Change route and i18next language
      const { pathname, asPath, query } = router;
      await Promise.all([
        router.push({ pathname, query }, asPath, { locale }),
        i18n.changeLanguage(locale)
      ]);
    } catch (error) {
      console.error('Failed to change locale:', error);
      // Revert changes on error
      const currentDir = router.locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = currentDir;
      document.documentElement.lang = router.locale || 'en';
      setCurrentDir(currentDir);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    t,
    isRTL: currentDir === 'rtl',
    currentLocale: router.locale || 'en',
    currentDir,
    isLoading,
    changeLocale
  };
}; 