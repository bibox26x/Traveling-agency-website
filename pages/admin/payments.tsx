import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Head from 'next/head';

interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  paymentMethod: string;
  proofImage: string | null;
  status: string;
  adminNote: string | null;
  confirmedAt: string | null;
  createdAt: string;
  booking: {
    trip: {
      title: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/payments');
      const { data } = response;
      if (response.status >= 400) {
        throw new Error('Failed to fetch payments');
      }
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId: number, status: string, adminNote: string = '') => {
    try {
      const response = await fetchWithAuth(`/api/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNote }),
      });

      const { data } = response;
      if (response.status >= 400) {
        throw new Error('Failed to update payment status');
      }

      // Refresh payments list
      fetchPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Payment Management - Admin Dashboard</title>
      </Head>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payment Management</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <li key={payment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary-600">
                            Payment #{payment.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            Trip: {payment.booking.trip.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Customer: {payment.booking.user.name} ({payment.booking.user.email})
                          </p>
                          <p className="text-sm text-gray-600">
                            Amount: ${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Method: {payment.paymentMethod}
                          </p>
                          {payment.proofImage && (
                            <a
                              href={payment.proofImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              View Payment Proof
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="ml-6">
                        <div className="flex space-x-3">
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(payment.id, 'confirmed')}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  const note = prompt('Enter rejection reason:');
                                  if (note !== null) {
                                    handleStatusUpdate(payment.id, 'rejected', note);
                                  }
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                              payment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                        {payment.adminNote && (
                          <p className="mt-2 text-sm text-gray-500">
                            Note: {payment.adminNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 