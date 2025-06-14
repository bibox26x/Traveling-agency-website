import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import DestinationCard from '../../components/DestinationCard';
import { Destination } from '../../types/destination';
import { getAllDestinations } from '../../services/destinationService';

interface DestinationsPageProps {
  destinations: Destination[];
}

const DestinationsPage: React.FC<DestinationsPageProps> = ({ destinations }) => {
  return (
    <Layout fullWidth>
      <Head>
        <title>Destinations - Travel Agency</title>
        <meta name="description" content="Explore our amazing travel destinations around the world" />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/destinations-hero.jpg"
            alt="Travel destinations"
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
                Discover Your Next
                <span className="block text-secondary-400 mt-2">Adventure</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 max-w-2xl animate-slide-in">
                Explore breathtaking destinations and create unforgettable memories around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">Explore</span>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
              Discover our carefully curated selection of the world's most extraordinary locations
            </p>
          </div>

          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✈️</div>
              <p className="text-xl text-gray-500">No destinations available at the moment.</p>
              <p className="text-gray-400">Please check back later for exciting new locations!</p>
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
            <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">Our Promise</span>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
              Why Travel With Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
              Experience the difference of traveling with a dedicated team of experts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🌟',
                title: 'Expert Guides',
                description: 'Our experienced local guides ensure you discover the authentic essence of each destination'
              },
              {
                icon: '🎯',
                title: 'Curated Experiences',
                description: 'Handpicked destinations and activities that create unforgettable memories'
              },
              {
                icon: '💎',
                title: 'Premium Service',
                description: '24/7 concierge support and meticulous attention to every detail of your journey'
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