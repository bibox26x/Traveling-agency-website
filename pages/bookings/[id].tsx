import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import PaymentForm from '../../components/payment/PaymentForm';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Head from 'next/head';

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
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await fetchWithAuth(`/bookings/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      const data = await response.json();
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking details');
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
        <title>Booking Details - Travel Agency</title>
      </Head>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
            </div>
          ) : booking ? (
            <div className="space-y-8">
              {/* Booking Details */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Booking Details
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Trip</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.trip.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.trip.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dates</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(booking.trip.start_date).toLocaleDateString()} - {new Date(booking.trip.end_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Guests</dt>
                      <dd className="mt-1 text-sm text-gray-900">{booking.guests}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Price</dt>
                      <dd className="mt-1 text-sm text-gray-900">${booking.total_price.toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Payment Status
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Total Price</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                          ${booking.total_price.toFixed(2)}
                        </dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Paid Amount</dt>
                        <dd className="mt-1 text-lg font-semibold text-green-600">
                          ${paymentStatus.totalPaid.toFixed(2)}
                        </dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Remaining Amount</dt>
                        <dd className="mt-1 text-lg font-semibold text-primary-600">
                          ${paymentStatus.remainingAmount.toFixed(2)}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment History */}
              {booking.payments.length > 0 && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Payment History
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                      {booking.payments.map((payment) => (
                        <li key={payment.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                ${payment.amount.toFixed(2)} - {payment.paymentMethod}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          {payment.adminNote && (
                            <p className="mt-2 text-sm text-gray-500">
                              Note: {payment.adminNote}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {paymentStatus && !paymentStatus.isFullyPaid && booking.status !== 'confirmed' && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Make a Payment
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <PaymentForm
                      bookingId={booking.id}
                      amount={paymentStatus.remainingAmount}
                      onSuccess={fetchBooking}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Booking not found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 