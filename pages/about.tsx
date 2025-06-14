import Layout from '../components/layout/Layout';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <Layout>
      <Head>
        <title>About Us - Travel Agency</title>
      </Head>

      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-primary-900 mb-4">
              About TravelAgency
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner in creating unforgettable travel experiences
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To provide exceptional travel experiences that inspire, educate, and connect people
                with the world's most remarkable destinations. We strive to make travel accessible,
                sustainable, and enriching for everyone.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be the world's most trusted travel companion, known for our personalized service,
                innovative solutions, and commitment to responsible tourism. We aim to transform the
                way people experience and appreciate the world.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-8">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">
                  Our team of experienced travel professionals ensures every trip is perfectly planned.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Secure Booking</h3>
                <p className="text-gray-600">
                  Your payments and personal information are protected with advanced security measures.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is always available to assist you during your journey.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-8">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Travel Street<br />
                  Adventure City, AC 12345<br />
                  United States
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Contact</h3>
                <p className="text-gray-600">
                  Phone: (555) 123-4567<br />
                  Email: info@travelagency.com
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9am - 6pm<br />
                  Saturday: 10am - 4pm<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 