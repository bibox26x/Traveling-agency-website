import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const navigation = [
  { name: 'navigation.destinations', href: '/destinations' },
  { name: 'navigation.about', href: '/about' },
  { name: 'navigation.contact', href: '/contact' },
];

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isRTL = router.locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile safe area color matching */}
      <div style={{ height: 'env(safe-area-inset-top)' }} className="fixed top-0 left-0 right-0 bg-primary-900" />
      
      <header className="fixed w-full bg-primary-900 shadow-lg z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className={`flex-shrink-0 ${isRTL ? 'order-first' : 'order-first'}`}>
              <Link href="/" className="flex items-center">
                <span className="font-display text-2xl text-white">TravelAgency</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex flex-1 ${isRTL ? 'mr-8' : 'ml-8'}`}>
              <div className={`flex ${isRTL ? 'space-x-8 space-x-reverse' : 'space-x-8'}`}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      router.pathname === item.href
                        ? 'text-secondary-400'
                        : 'text-white hover:text-secondary-300'
                    }`}
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Desktop Auth Buttons and Language Switcher */}
            <div className={`hidden md:flex md:items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
              <LanguageSwitcher />
              {user ? (
                <>
                  <Link
                    href="/bookings"
                    className="text-sm font-medium text-white hover:text-secondary-300"
                  >
                    {t('navigation.bookings')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-white hover:text-secondary-300"
                    >
                      {t('navigation.admin')}
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-white hover:text-secondary-300"
                  >
                    {t('navigation.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white hover:text-secondary-300"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                  >
                    {t('navigation.signup')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className={`md:hidden ${isRTL ? 'order-first' : 'order-last'}`}>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">{t('common.toggleMenu')}</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className={`px-2 pb-3 pt-2 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              {/* Language Switcher in Mobile Menu */}
              <div className={`px-3 py-2 ${isRTL ? 'flex justify-end' : ''}`}>
                <LanguageSwitcher />
              </div>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    router.pathname === item.href
                      ? 'bg-primary-800 text-secondary-400'
                      : 'text-white hover:bg-primary-800 hover:text-secondary-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.name)}
                </Link>
              ))}

              <div className="border-t border-primary-800 pt-4 pb-3">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/bookings"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navigation.bookings')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navigation.admin')}
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navigation.profile')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                    >
                      {t('navigation.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navigation.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navigation.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 