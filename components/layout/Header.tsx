import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary-900/80 backdrop-blur-sm">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-display text-2xl text-white">TravelAgency</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
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
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link
                  href="/bookings"
                  className="text-sm font-medium text-white hover:text-secondary-300"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-white hover:text-secondary-300"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-secondary-300"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
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
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
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
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/bookings"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-center text-base font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-800 hover:text-secondary-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="mt-2 block w-full rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-6 py-2.5 text-center text-base font-medium text-white shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/50 hover:-translate-y-0.5 transform transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 