import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import DestinationCard from '../components/DestinationCard';
import { Destination } from '../types/destination';
import { getAllDestinations } from '../services/destinationService';
import Hero from '../components/sections/Hero';

interface HomePageProps {
  destinations: Destination[];
}

const HomePage: React.FC<HomePageProps> = ({ destinations }) => {
  return (
    <Layout fullWidth>
      <Head>
        <title>Travel Agency - Your Journey Begins Here</title>
        <meta name="description" content="Discover amazing travel destinations and adventures around the world" />
      </Head>

      <Hero />

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">Top Picks</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of the world's most extraordinary locations
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
              View All Destinations
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
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience travel like never before with our premium services and expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Expert Guides</h3>
              <p className="text-gray-600">
                Our experienced local guides ensure you discover the authentic essence of each destination
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Curated Experiences</h3>
              <p className="text-gray-600">
                Handpicked destinations and activities that create unforgettable memories
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Premium Service</h3>
              <p className="text-gray-600">
                24/7 concierge support and meticulous attention to every detail of your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary-500 font-semibold text-lg mb-2 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read about the amazing experiences of our satisfied travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Sarah Johnson</h4>
                  <p className="text-gray-600">Paris Adventure</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "An absolutely incredible experience! The guides were knowledgeable and the itinerary was perfect.
                I couldn't have asked for a better trip."
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Michael Chen</h4>
                  <p className="text-gray-600">Tokyo Explorer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The attention to detail was outstanding. Every aspect of our trip was carefully planned,
                making it a stress-free and enjoyable experience."
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Emma Davis</h4>
                  <p className="text-gray-600">African Safari</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "A life-changing journey that exceeded all expectations. The local guides provided
                insights that made our safari truly special."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-primary-900">
          <Image
            src="/images/cta-bg.jpg"
            alt="Travel inspiration"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8">Let us help you create the perfect journey tailored to your dreams</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-400 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>Start Planning</span>
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
              <Link
                href="/destinations"
                className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl text-lg font-semibold hover:bg-white/20 border border-white/20 shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>Browse Destinations</span>
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

export default HomePage;
