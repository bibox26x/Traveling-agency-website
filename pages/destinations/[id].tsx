import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import TripCard from '../../components/TripCard';
import { Destination } from '../../types/destination';
import { getDestinationById, getDestinationTrips } from '../../services/destinationService';

interface DestinationDetailsProps {
  destination: Destination;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({ destination }) => {
  return (
    <Layout fullWidth>
      <Head>
        <title>{destination.name} - Travel Agency</title>
        <meta name="description" content={destination.description} />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full flex items-center">
        <div className="absolute inset-0">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
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
                {destination.name}
                <span className="block text-secondary-400 mt-2 text-3xl sm:text-4xl">{destination.country}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed animate-slide-in">{destination.description}</p>
          </div>
        </div>
      </section>

      {/* Available Trips */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block animate-fade-in">Explore</span>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 animate-fade-in">
              Available Trips
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-in">
              Choose from our selection of amazing adventures in {destination.name}
            </p>
          </div>

          {destination.trips.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-5xl mb-4">✈️</div>
              <p className="text-xl text-gray-500">No trips available at the moment.</p>
              <p className="text-gray-400">Please check back later for exciting new adventures!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destination.trips.map((trip, index) => (
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
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return {
        notFound: true,
      };
    }

    const destination = await getDestinationById(id);
    const trips = await getDestinationTrips(id);
    destination.trips = trips;

    return {
      props: {
        destination,
      },
    };
  } catch (error) {
    console.error('Error fetching destination:', error);
    return {
      notFound: true,
    };
  }
};

export default DestinationDetails; 