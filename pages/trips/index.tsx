import React, { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import TripCard from '../../components/TripCard';
import TripFilters from '../../components/trips/TripFilters';
import { Trip, TripFilters as TripFiltersType } from '../../types/trip';
import { trips } from '../../services/api';
import { useTranslation } from 'next-i18next';

interface TripsPageProps {
  availableTrips: Trip[];
}

const TripsPage: React.FC<TripsPageProps> = ({ availableTrips }) => {
  const { t } = useTranslation('common');
  const [filteredTrips, setFilteredTrips] = useState(availableTrips);

  const handleFilterChange = useCallback((filters: TripFiltersType) => {
    const filtered = availableTrips.filter(trip => {
      // Search query filter
      if (filters.searchQuery && !trip.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location && !trip.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && trip.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && trip.price > filters.maxPrice) {
        return false;
      }

      // Date range filter
      if (filters.startDate) {
        const tripStart = new Date(trip.startDate);
        const filterStart = new Date(filters.startDate);
        if (tripStart < filterStart) {
          return false;
        }
      }
      if (filters.endDate) {
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(tripStart.getTime() + trip.duration * 24 * 60 * 60 * 1000);
        const filterEnd = new Date(filters.endDate);
        if (tripEnd > filterEnd) {
          return false;
        }
      }

      return true;
    });

    setFilteredTrips(filtered);
  }, [availableTrips]);

  return (
    <Layout fullWidth>
      <Head>
        <title>{t('meta.trips.title')}</title>
        <meta name="description" content={t('meta.trips.description')} />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/trips-hero.jpg"
            alt={t('trips.title')}
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
                {t('trips.title')}
                <span className="block text-secondary-400 mt-2">{t('trips.hero.subtitle')}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 max-w-2xl animate-slide-in">
                {t('trips.hero.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-12">
            <TripFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Trip Grid */}
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✈️</div>
              <p className="text-xl text-gray-500">{t('trips.noTrips.title')}</p>
              <p className="text-gray-400">{t('trips.noTrips.subtitle')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">
              {t('trips.features.label')}
            </span>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
              {t('trips.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
              {t('trips.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🌟',
                title: t('home.whyChooseUs.expertGuides.title'),
                description: t('home.whyChooseUs.expertGuides.description')
              },
              {
                icon: '🛡️',
                title: t('home.whyChooseUs.safeTravel.title'),
                description: t('home.whyChooseUs.safeTravel.description')
              },
              {
                icon: '💎',
                title: t('home.whyChooseUs.premiumService.title'),
                description: t('home.whyChooseUs.premiumService.description')
              },
              {
                icon: '🤝',
                title: t('home.whyChooseUs.support.title'),
                description: t('home.whyChooseUs.support.description')
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const availableTrips = await trips.getAll();
    return {
      props: {
        availableTrips,
      },
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      props: {
        availableTrips: [],
      },
    };
  }
};

export default TripsPage; 