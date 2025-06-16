import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import BookingCard from '../components/bookings/BookingCard';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types/booking';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function BookingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetchWithAuth('/bookings');
      const { data } = response;
      
      if (response.status >= 400) {
        throw new Error(data.error || data.message || t('errors.fetchBookings'));
      }

      setBookings(data);
      setError('');
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err instanceof Error ? err.message : t('errors.fetchBookings'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>{t('bookings.title')} - {t('common.brand')}</title>
        </Head>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.signInRequired')}</h2>
                <p className="text-gray-600 mb-6">{t('auth.signInToViewBookings')}</p>
                <a
                  href="/login?redirect=/bookings"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
                >
                  {t('auth.signIn')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Head>
          <title>{t('bookings.title')} - {t('common.brand')}</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
              <span className="ml-3 text-gray-600">{t('pages.bookings.loading')}</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{t('bookings.title')} - {t('common.brand')}</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('bookings.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('bookings.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{t('common.error')}: </strong>
              <span className="block sm:inline">{error}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError('')}
              >
                <span className="sr-only">{t('common.dismiss')}</span>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}

          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
            {bookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('bookings.noBookings')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
