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
        // Update cookie first with more specific options
        setLanguageCookie(lang.code);
        
        // Force cookie update in case the previous call failed
        document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        
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
      <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <GlobeAltIcon className="w-5 h-5 mr-2" aria-hidden="true" />
        <span>{currentLanguage.localName}</span>
      </Menu.Button>

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
                    disabled={isChanging}
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'w-full text-left px-4 py-2 text-sm flex items-center space-x-2',
                      isChanging && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <span>{language.localName}</span>
                    {router.locale === language.code && (
                      <span className="ml-auto text-primary-600">✓</span>
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