import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import PaymentForm from '../../components/payment/PaymentForm';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Payment {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string;
  proofImage: string | null;
  adminNote: string | null;
  createdAt: string;
}

interface Booking {
  id: number;
  trip: {
    title: string;
    location: string;
    start_date: string;
    end_date: string;
    price: number;
  };
  guests: number;
  total_price: number;
  status: string;
  booking_date: string;
  payments: Payment[];
}

export default function BookingDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('common');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetchWithAuth(`/bookings/${id}`);
      const { data } = response;
      
      if (response.status >= 400) {
        throw new Error(data.error || data.message || t('errors.fetchBookingDetails'));
      }

      setBooking(data);
      setError('');
    } catch (err) {
      console.error('Fetch booking details error:', err);
      setError(err instanceof Error ? err.message : t('errors.fetchBookingDetails'));
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = () => {
    if (!booking) return null;

    const confirmedPayments = booking.payments.filter(p => p.status === 'confirmed');
    const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = booking.total_price - totalPaid;

    return {
      totalPaid,
      remainingAmount,
      isFullyPaid: totalPaid >= booking.total_price
    };
  };

  const paymentStatus = getPaymentStatus();

  return (
    <Layout>
      <Head>
        <title>{t('bookings.bookingDetails')} - {t('common.brand')}</title>
      </Head>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
              <span className="ml-3 text-gray-600">{t('pages.bookings.loading')}</span>
            </div>
          ) : booking ? (
            <div className="space-y-8">
              {/* Booking Details */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('bookings.bookingDetails')}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.details.tripName')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.trip.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.details.location')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.trip.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.travelDate')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(booking.trip.start_date).toLocaleDateString()} - {new Date(booking.trip.end_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.passengers')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.guests}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.totalPrice')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">${booking.total_price.toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('bookings.bookingStatus')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{t(`bookings.status.${booking.status}`)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('bookings.details.paymentInfo.title')}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{t('bookings.details.paymentInfo.totalPaid')}</dt>
                        <dd className="mt-1 text-sm text-gray-900">${paymentStatus.totalPaid.toFixed(2)}</dd>
                      </div>
                      {!paymentStatus.isFullyPaid && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t('bookings.details.paymentInfo.remaining')}</dt>
                          <dd className="mt-1 text-sm text-gray-900">${paymentStatus.remainingAmount.toFixed(2)}</dd>
                        </div>
                      )}
                      {paymentStatus.isFullyPaid && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t('bookings.details.paymentInfo.fullyPaid')}</dt>
                          <dd className="mt-1 text-sm text-gray-900">✓</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {paymentStatus && !paymentStatus.isFullyPaid && booking.status !== 'confirmed' && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('pages.bookings.payment.title')}
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <PaymentForm
                      bookingId={booking.id}
                      amount={paymentStatus.remainingAmount}
                      onSuccess={fetchBookingDetails}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('bookings.notFound')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
} 