import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import DestinationCard from '../../components/DestinationCard';
import { Destination } from '../../types/destination';
import { getAllDestinations } from '../../services/destinationService';

interface DestinationsPageProps {
  destinations: Destination[];
}

const DestinationsPage: React.FC<DestinationsPageProps> = ({ destinations }) => {
  const { t } = useTranslation('common');

  return (
    <ProtectedRoute publicRoute>
      <Layout fullWidth>
        <Head>
          <title>{t('meta.destinations.title')}</title>
          <meta name="description" content={t('meta.destinations.description')} />
        </Head>

        {/* Hero Section */}
        <div className="relative min-h-[60vh] w-full flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations-hero.jpg"
              alt={t('destinations.hero.title')}
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
                  {t('destinations.hero.title')}
                  <span className="block text-secondary-400 mt-2">{t('destinations.hero.subtitle')}</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-2xl animate-slide-in">
                  {t('destinations.hero.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">
                {t('destinations.explore.label')}
              </span>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
                {t('destinations.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
                {t('destinations.explore.subtitle')}
              </p>
            </div>

            {destinations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✈️</div>
                <p className="text-xl text-gray-500">{t('destinations.noDestinations.title')}</p>
                <p className="text-gray-400">{t('destinations.noDestinations.subtitle')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <DestinationCard destination={destination} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">
                {t('destinations.whyChooseUs.label')}
              </span>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
                {t('destinations.whyChooseUs.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
                {t('destinations.whyChooseUs.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🌟',
                  title: t('home.whyChooseUs.expertGuides.title'),
                  description: t('home.whyChooseUs.expertGuides.description')
                },
                {
                  icon: '🎯',
                  title: t('home.whyChooseUs.curatedExperiences.title'),
                  description: t('home.whyChooseUs.curatedExperiences.description')
                },
                {
                  icon: '💎',
                  title: t('home.whyChooseUs.premiumService.title'),
                  description: t('home.whyChooseUs.premiumService.description')
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const destinations = await getAllDestinations();
    return {
      props: {
        destinations,
      },
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      props: {
        destinations: [],
      },
    };
  }
};

export default DestinationsPage; 