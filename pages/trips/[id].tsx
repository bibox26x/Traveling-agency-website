import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import BookingModal from '../../components/bookings/BookingModal';
import { Trip } from '../../types/trip';
import { formatDate, calculateEndDate, formatDateRange } from '../../utils/dateUtils';
import { trips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
  };

  const endDate = calculateEndDate(new Date(trip.startDate), trip.duration);

  if (!mounted) {
    return null;
  }

  return (
    <Layout fullWidth>
      <Head>
        <title>{t('meta.trips.title', { trip: trip.title })}</title>
        <meta name="description" content={trip.description} />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full flex items-center">
        <div className="absolute inset-0">
          <Image
            src={trip.imageUrl || '/images/default-trip.jpg'}
            alt={trip.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-[#0F3E61]/80" />
        </div>
        <div className="relative w-full">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-4 animate-fade-in">
                {trip.title}
                <span className="block text-secondary-400 mt-2 text-3xl sm:text-4xl">{trip.location}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8 animate-fade-in">
              <Link
                href="/destinations"
                className="text-secondary-500 hover:text-secondary-600 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('tripDetails.backToDestinations')}
              </Link>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slide-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6">{t('tripDetails.overview.title')}</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">{trip.description}</p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('tripDetails.overview.dates')}</h3>
                      <p className="text-gray-600">
                        {formatDateRange(trip.startDate, calculateEndDate(new Date(trip.startDate), trip.duration).toISOString())}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('tripDetails.overview.duration')}</h3>
                      <p className="text-gray-600">{trip.duration} {t('tripDetails.overview.days')}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('tripDetails.overview.location')}</h3>
                      <p className="text-gray-600">{trip.location}</p>
                    </div>
                  </div>
                </div>

                {/* Price and Booking Section */}
                <div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">{t('tripDetails.pricing.price')}</span>
                      <span className="text-2xl font-bold text-primary-600">${trip.price}</span>
                    </div>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
                    >
                      {t('tripDetails.pricing.bookNow')}
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('tripDetails.additionalInfo.title')}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('tripDetails.additionalInfo.freeCancellation')}
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('tripDetails.additionalInfo.instantConfirmation')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        trip={trip}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return {
        notFound: true,
      };
    }

    const trip = await trips.getById(id);
    
    if (!trip) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
        trip,
      },
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return {
      notFound: true,
    };
  }
};

export default TripDetails;
