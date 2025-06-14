import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/payments/mine')
      .then(res => setPayments(res.data))
      .catch(() => setError('Failed to load payments'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-700">My Payments</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-blue-100">
            <thead>
              <tr className="bg-blue-50 border-b">
                <th className="py-3 px-4 text-blue-700 font-bold">Amount</th>
                <th className="py-3 px-4 text-blue-700 font-bold">Status</th>
                <th className="py-3 px-4 text-blue-700 font-bold">Date</th>
                <th className="py-3 px-4 text-blue-700 font-bold">Booking</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b">
                  <td className="py-3 px-4">${payment.amount}</td>
                  <td className="py-3 px-4">{payment.status}</td>
                  <td className="py-3 px-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{payment.booking?.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
