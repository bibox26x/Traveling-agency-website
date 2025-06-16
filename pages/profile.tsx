import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { Booking } from '../types/booking';
import api from '../services/api';
import { useTranslation } from 'next-i18next';
import { useAuth } from '../context/AuthContext';
import { withAuth } from '../components/hoc/withAuth';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import Head from 'next/head';

function ProfilePage() {
  const { t } = useTranslation('common');
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'settings' | 'bookings'>('settings');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      const response = await api.patch('/api/users/profile', { phone, email });
      updateUser(response.data);
      setSuccessMessage(t('pages.profile.updateSuccess'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.error || t('pages.profile.updateError');
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('pages.profile.title')} - {t('common.brand')}</title>
        <meta name="description" content={t('profile.meta.description')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900">
              {t('pages.profile.title')}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {t('profile.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveSection('settings')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === 'settings' 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t('pages.profile.settings.title')}
                  </button>
                  <button 
                    onClick={() => setActiveSection('bookings')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === 'bookings' 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t('pages.profile.bookings.title')}
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {activeSection === 'settings' ? (
                  /* Profile Settings */
                  <div>
                    <div className="border-b border-gray-200 pb-6 mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {t('pages.profile.settings.title')}
                      </h2>
                      <p className="mt-1 text-gray-600">
                        {t('pages.profile.settings.description')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('pages.profile.personalInfo.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pages.profile.personalInfo.name')}
                            </label>
                            <input
                              type="text"
                              value={user?.name || ''}
                              readOnly
                              className="block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pages.profile.personalInfo.email')}
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full rounded-lg border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pages.profile.personalInfo.phone')}
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t('pages.profile.personalInfo.phonePlaceholder')}
                              className="block w-full rounded-lg border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {(successMessage || errorMessage) && (
                          <div className={`mt-4 p-4 rounded-lg ${errorMessage ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {errorMessage || successMessage}
                          </div>
                        )}

                        {/* Save Button */}
                        <div className="pt-6 border-t border-gray-200">
                          <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 hover:-translate-y-0.5 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? t('ui.form.saving') : t('ui.form.save')}
                          </button>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('profile.preferences')}
                        </h3>
                        <div className="space-y-4">
                          {/* Language */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pages.profile.settings.language')}
                            </label>
                            <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5">
                              <option value="en">{t('languages.english')}</option>
                              <option value="fr">{t('languages.french')}</option>
                              <option value="ar">{t('languages.arabic')}</option>
                            </select>
                          </div>

                          {/* Currency */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pages.profile.settings.currency')}
                            </label>
                            <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5">
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                            </select>
                          </div>

                          {/* Notifications */}
                          <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                              <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600 rounded" />
                              <span className="text-gray-700">{t('profile.emailNotifications')}</span>
                            </label>
                            <label className="flex items-center space-x-3">
                              <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600 rounded" />
                              <span className="text-gray-700">{t('profile.smsNotifications')}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Privacy Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {t('pages.profile.settings.privacy')}
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600 rounded" />
                            <span className="text-gray-700">{t('pages.profile.settings.showProfile')}</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600 rounded" />
                            <span className="text-gray-700">{t('pages.profile.settings.publicBookings')}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Bookings Section */
                  <div>
                    <div className="border-b border-gray-200 pb-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {t('pages.profile.bookings.title')}
                          </h2>
                          <p className="mt-1 text-gray-600">
                            {t('pages.profile.bookings.description')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600">{t('bookings.noBookings')}</p>
                          <Link 
                            href="/destinations" 
                            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {t('destinations.exploreDestination')}
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking) => (
                            <div 
                              key={booking.id} 
                              className="border border-gray-200 rounded-xl p-6 hover:border-primary-500 transition-colors duration-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {t('bookings.details.tripName')}: {booking.trip?.title || t('bookings.details.tripNotFound')}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {t('bookings.details.bookingId')}: #{booking.id}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {t('bookings.details.dates')}: {new Date(booking.bookingDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {t('bookings.details.participants')}: {booking.guests}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {t('bookings.details.duration')}: {booking.trip?.duration || t('bookings.details.durationNotAvailable')}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {t('bookings.details.totalPrice')}: ${booking.totalPrice}
                                  </p>
                                </div>
                                <div className="text-right space-y-2">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">{t('bookings.bookingStatus')}:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                        booking.status === 'confirmed' 
                                          ? 'bg-green-50 text-green-800 border-green-200'
                                          : booking.status === 'cancelled'
                                          ? 'bg-red-50 text-red-800 border-red-200'
                                          : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                      }`}>
                                        {t(`bookings.status.${booking.status}`)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">{t('bookings.paymentStatusTitle')}:</span>
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                        booking.paymentStatus === 'paid'
                                          ? 'bg-green-50 text-green-800 border-green-200'
                                          : booking.paymentStatus === 'refunded'
                                          ? 'bg-gray-50 text-gray-800 border-gray-200'
                                          : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                      }`}>
                                        {t(`bookings.paymentStatus.${booking.paymentStatus}`)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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

export default withAuth(ProfilePage); 