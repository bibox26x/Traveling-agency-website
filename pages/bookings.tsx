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
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetchWithAuth('/api/bookings?status=pending');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{t('pages.bookings.pendingTitle')} - {t('common.brand')}</title>
        <meta name="description" content={t('pages.bookings.pendingDescription')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900">
              {t('pages.bookings.pendingTitle')}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {t('pages.bookings.pendingDescription')}
            </p>
            <Link 
              href="/profile"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('pages.bookings.viewAllBookings')} {isRTL ? '←' : '→'}
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('bookings.noPendingBookings')}</p>
              <Link 
                href="/destinations" 
                className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('destinations.exploreDestination')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
