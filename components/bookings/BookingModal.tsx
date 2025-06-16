import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Trip } from '../../types/trip';
import { Button } from '@heroui/react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';

interface BookingModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ trip, isOpen, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const [guests, setGuests] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to book this trip');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          tripId: trip.id,
          numberOfPeople: guests,
          totalPrice: trip.price * guests,
          specialRequirements: specialRequirements.trim() || undefined
        }),
      });

      const { data } = response;
      if (response.status >= 400) {
        throw new Error(data.error || data.message || 'Failed to create booking');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative animate-fade-in">
        <Button
          onClick={onClose}
          color="default"
          variant="light"
          size="sm"
          className={clsx(
            "absolute top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200",
            isRTL ? "left-4" : "right-4"
          )}
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        <h2 className="text-2xl font-display font-bold mb-6">{t('bookingModal.title')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('bookingModal.numberOfGuests')}
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                disabled={guests <= 1 || loading}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xl font-semibold">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(prev => prev + 1)}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('bookingModal.specialRequirements.label')} 
              <span className="text-gray-500 ml-1">{t('bookingModal.specialRequirements.optional')}</span>
            </label>
            <textarea
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 focus:outline-none disabled:opacity-50"
              rows={3}
              placeholder={t('bookingModal.specialRequirements.placeholder')}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('bookingModal.pricing.pricePerPerson')}</span>
              <span className="font-semibold">${trip.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('bookingModal.pricing.totalPrice')}</span>
              <span className="text-secondary-500">${(trip.price * guests).toLocaleString()}</span>
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            variant="solid"
            size="lg"
            fullWidth
            isLoading={loading}
            disabled={loading}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 rounded-xl font-medium"
          >
            {t('bookingModal.confirmBooking')}
          </Button>
        </form>
      </div>
    </div>
  );
} 