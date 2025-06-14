import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { Trip, BookingRequest } from '../../types/trip';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@heroui/react';

interface Props {
  trip: Trip;
  onSuccess: () => void;
}

export default function BookingForm({ trip, onSuccess }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<BookingRequest>({
    tripId: trip.id,
    guests: 1,
    specialRequirements: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.post('/bookings', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-blue-700">Book Your Trip</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          name="guests"
          min={1}
          value={formData.guests}
          onChange={handleChange}
          className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requirements
        </label>
        <textarea
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          rows={4}
          placeholder="Any dietary restrictions, accessibility needs, or other special requirements?"
          className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">
          Total: ${trip.price * formData.guests}
        </div>
        <Button
          type="submit"
          color="primary"
          variant="solid"
          size="lg"
          disabled={loading}
          isLoading={loading}
          className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
        >
          Book Now
        </Button>
      </div>
    </form>
  );
} 