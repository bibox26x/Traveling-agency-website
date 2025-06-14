import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import BookingModal from '../../components/bookings/BookingModal';
import { Trip } from '../../types/trip';
import { formatDate, calculateEndDate } from '../../utils/dateUtils';
import { trips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const handleBookingSuccess = () => {
    router.reload();
  };

  const endDate = calculateEndDate(new Date(trip.startDate), trip.duration);

  return (
    <Layout fullWidth>
      <Head>
        <title>{trip.title} - Travel Agency</title>
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
                Back to Destinations
              </Link>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slide-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6">Trip Overview</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">{trip.description}</p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Dates</h3>
                      <p className="text-gray-600">
                        {formatDate(trip.startDate)} - {formatDate(endDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Duration</h3>
                      <p className="text-gray-600">{trip.duration} days</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Location</h3>
                      <p className="text-gray-600">{trip.location}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 rounded-xl p-8">
                    <h3 className="text-2xl font-display font-bold mb-6">Trip Details</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price</span>
                        <span className="text-2xl font-display font-bold text-secondary-500">
                          ${trip.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-secondary-500 to-secondary-400 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-secondary-500/25 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={() => {
                          if (!user) {
                            router.push('/login?redirect=' + router.asPath);
                            return;
                          }
                          setIsBookingModalOpen(true);
                        }}
                      >
                        <span>Book Now</span>
                        <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-delayed">
              <h2 className="text-3xl font-display font-bold mb-8">What to Expect</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-6">Included</h3>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">What's Included</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">Professional guide</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">Transportation</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">Accommodation</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">Equipment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-6">Requirements</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Valid passport
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Travel insurance
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic fitness level
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Appropriate clothing
                    </li>
                  </ul>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
