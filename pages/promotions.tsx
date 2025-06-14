import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/promotions')
      .then(res => setPromotions(res.data))
      .catch(() => setError('Failed to load promotions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-700">Promotions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">{promo.title}</h3>
              <p className="mb-2 text-gray-700">{promo.description}</p>
              <p className="text-blue-600 font-semibold">Valid until: {new Date(promo.validUntil).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
