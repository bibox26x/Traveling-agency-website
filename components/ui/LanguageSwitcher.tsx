import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { setLanguageCookie } from '../../utils/cookie-utils';
import clsx from 'clsx';

const languages = [
  { code: 'en', name: 'English', localName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'fr', name: 'French', localName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', localName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { pathname, asPath, query } = router;
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === router.locale);
    if (currentLang) {
      document.documentElement.dir = currentLang.dir;
      document.documentElement.lang = currentLang.code;
      // Add RTL class to body for global RTL styles
      if (currentLang.dir === 'rtl') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }
    }
  }, [router.locale]);

  const changeLanguage = async (locale: typeof languages[number]['code']) => {
    const lang = languages.find(l => l.code === locale);
    if (lang && !isChanging && router.locale !== locale) {
      setIsChanging(true);
      try {
        // Update cookie first
        setLanguageCookie(lang.code);
        
        // Update document attributes
        document.documentElement.dir = lang.dir;
        document.documentElement.lang = lang.code;
        
        // Change both Next.js route and i18next language
        await Promise.all([
          router.replace({ pathname, query }, asPath, { 
            locale,
            scroll: false // Prevent scroll jump
          }),
          i18n.changeLanguage(locale)
        ]);

        // Update body classes after successful change
        if (lang.dir === 'rtl') {
          document.body.classList.add('rtl');
          document.body.classList.remove('ltr');
        } else {
          document.body.classList.add('ltr');
          document.body.classList.remove('rtl');
        }
      } catch (error) {
        console.error('Failed to change language:', error);
        // Revert changes on error
        const currentLang = languages.find(l => l.code === router.locale) || languages[0];
        document.documentElement.dir = currentLang.dir;
        document.documentElement.lang = currentLang.code;
        setLanguageCookie(currentLang.code);
      } finally {
        setIsChanging(false);
      }
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md">
        <GlobeAltIcon className="w-5 h-5 mr-2" aria-hidden="true" />
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          disabled={isChanging}
          className={clsx(
            "inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium",
            "bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200",
            isChanging ? "opacity-70 cursor-not-allowed" : "text-gray-700",
            currentLanguage.dir === 'rtl' ? 'font-arabic' : 'font-sans'
          )}
        >
          {isChanging ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </>
          ) : (
            <>
              <GlobeAltIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              <span className="mr-1">{currentLanguage.flag}</span>
              <span>{currentLanguage.localName}</span>
            </>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(language.code)}
                    className={clsx(
                      'group flex items-center w-full px-4 py-2 text-sm',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      language.dir === 'rtl' ? 'font-arabic text-right' : 'font-sans text-left',
                      isChanging && 'opacity-50 cursor-not-allowed',
                      language.code === router.locale && 'bg-gray-50'
                    )}
                    disabled={isChanging || language.code === router.locale}
                    dir={language.dir}
                    lang={language.code}
                  >
                    <span className="mr-2">{language.flag}</span>
                    <span>{language.localName}</span>
                    <span className="mx-2 text-gray-400">-</span>
                    <span className="text-gray-500">{language.name}</span>
                    {language.code === router.locale && (
                      <span className="ml-auto text-indigo-600">✓</span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 