import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import DestinationCard from '../components/DestinationCard';
import { Destination } from '../types/destination';
import { getAllDestinations } from '../services/destinationService';
import Hero from '../components/sections/Hero';
import { SEO } from '../components/layout/SEO';

interface HomePageProps {
  destinations: Destination[];
}

const HomePage: React.FC<HomePageProps> = ({ destinations }) => {
  const { t } = useTranslation('common');

  return (
    <Layout fullWidth>
      <Head>
        <title>{t('home.meta.title')}</title>
        <meta name="description" content={t('home.meta.description')} />
      </Head>

      <SEO
        title={t('meta.home.title')}
        description={t('meta.defaultDescription')}
      />

      <Hero />

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">{t('home.destinations.topPicks')}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">{t('destinations.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.destinations.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.slice(0, 6).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-secondary-500 to-secondary-400 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 group"
            >
              {t('destinations.viewAll')}
              <svg 
                className="w-6 h-6 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">{t('home.whyChooseUs.label')}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">{t('home.whyChooseUs.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['expertGuides', 'curatedExperiences', 'premiumService'].map((feature) => (
              <div key={feature} className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{t(`home.whyChooseUs.${feature}.icon`)}</span>
              </div>
                <h3 className="text-2xl font-display font-bold mb-4">{t(`home.whyChooseUs.${feature}.title`)}</h3>
              <p className="text-gray-600">
                  {t(`home.whyChooseUs.${feature}.description`)}
              </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">{t('home.testimonials.label')}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['paris', 'tokyo', 'safari'].map((testimonial) => (
              <div key={testimonial} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t(`home.testimonials.${testimonial}.name`)}</h4>
                    <p className="text-gray-600">{t(`home.testimonials.${testimonial}.trip`)}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  {t(`home.testimonials.${testimonial}.quote`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-primary-900">
          <Image
            src="/images/cta-bg.jpg"
            alt={t('home.cta.backgroundAlt')}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl mb-8">{t('home.cta.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-400 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>{t('home.cta.button')}</span>
                <svg 
                  className="w-6 h-6 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const destinations = await getAllDestinations();
    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
        destinations,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
        destinations: [],
      },
      revalidate: 60,
    };
  }
};

export default HomePage;
