import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/reviews/mine')
      .then(res => setReviews(res.data))
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-700">My Reviews</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <div className="flex items-center mb-2">
                <span className="text-blue-700 font-bold mr-2">Trip:</span> {review.trip?.title}
              </div>
              <div className="mb-2">Rating: <span className="font-semibold">{review.rating}</span></div>
              <div className="text-gray-700">{review.comment}</div>
              <div className="text-gray-400 text-sm mt-2">{new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
