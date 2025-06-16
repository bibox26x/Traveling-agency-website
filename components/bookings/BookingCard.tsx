import React, { useState } from 'react';
import type { Booking, BookingStatus, PaymentStatus } from '../../types/booking';
import { useAuth } from '../../context/AuthContext';
import { calculateEndDate } from '../../utils/dateUtils';
import { Button } from '@heroui/react';
import { useTranslation } from 'next-i18next';
import CountdownTimer from './CountdownTimer';

interface Props {
  booking: Booking;
  onStatusChange?: (bookingId: number, newStatus: BookingStatus) => Promise<void>;
  onPaymentStatusChange?: (bookingId: number, newStatus: PaymentStatus) => Promise<void>;
  onDelete?: (bookingId: number) => Promise<void>;
}

export default function BookingCard({ 
  booking, 
  onStatusChange, 
  onPaymentStatusChange,
  onDelete
}: Props) {
  const { user: currentUser } = useAuth();
  const { t, i18n } = useTranslation('common');
  const {
    id,
    trip,
    status = 'pending',
    totalPrice,
    bookingDate,
    guests,
    specialRequirements,
    paymentStatus = 'pending',
    user: bookingUser,
    expiresAt
  } = booking || {};

  const handleDelete = async () => {
    if (window.confirm(t('bookings.cancellationWarning'))) {
      await onDelete?.(id);
    }
  };

  const handleExpire = async () => {
    // Optionally refresh the booking list or mark as expired locally
    if (onStatusChange) {
      await onStatusChange(id, 'cancelled');
    }
  };

  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-50 text-green-800 border-green-200',
    cancelled: 'bg-red-50 text-red-800 border-red-200'
  };

  const paymentStatusColors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    paid: 'bg-green-50 text-green-800 border-green-200',
    refunded: 'bg-gray-50 text-gray-800 border-gray-200'
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!booking || !trip) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex items-center justify-center">
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="ml-3 text-gray-500 font-medium">{t('bookings.noBookings')}</p>
        </div>
      </div>
    );
  }

  const endDate = calculateEndDate(new Date(trip.startDate), trip.duration);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{trip.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('bookings.bookingDate')}: {formatDate(bookingDate)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('bookings.bookingStatus')}:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status as BookingStatus]}`}>
                {t(`bookings.status.${status}`)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('bookings.paymentStatusTitle')}:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentStatusColors[paymentStatus as PaymentStatus]}`}>
                {t(`bookings.paymentStatus.${paymentStatus}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Add countdown timer for pending payments */}
        {status !== 'cancelled' && paymentStatus === 'pending' && expiresAt && (
          <div className="mb-6 bg-yellow-50 rounded-lg p-4">
            <CountdownTimer
              expiresAt={expiresAt}
              isPaid={paymentStatus !== 'pending'}
              onExpire={handleExpire}
            />
          </div>
        )}

        {currentUser?.role === 'admin' && bookingUser && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('bookings.details.customerInfo')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('bookings.details.name')}</p>
                <p className="text-sm font-medium text-gray-900">{bookingUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('bookings.details.email')}</p>
                <p className="text-sm font-medium text-gray-900">{bookingUser.email}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">{t('bookings.details.phone')}</p>
                <p className="text-sm font-medium text-gray-900">
                  {bookingUser.phone ? (
                    <a href={`tel:${bookingUser.phone}`} className="text-primary-600 hover:text-primary-700">
                      {bookingUser.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">{t('bookings.details.phoneNotProvided')}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('bookings.details.location')}</p>
              <p className="mt-1 text-base text-gray-900">{trip.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('bookings.travelDate')}</p>
              <p className="mt-1 text-base text-gray-900">
                {formatDate(trip.startDate)} - {formatDate(endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('trips.duration')}</p>
              <p className="mt-1 text-base text-gray-900">{trip.duration}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('bookings.passengers')}</p>
              <p className="mt-1 text-base text-gray-900">{guests || 0} {t('bookings.details.participants')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('bookings.totalPrice')}</p>
              <p className="mt-1 text-base text-gray-900">${(totalPrice || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {specialRequirements && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">{t('bookings.details.specialRequirements')}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{specialRequirements}</p>
            </div>
          </div>
        )}

        {currentUser?.role === 'admin' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bookings.bookingStatus')}
                </label>
                <select
                  value={status}
                  onChange={(e) => onStatusChange?.(id, e.target.value as BookingStatus)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                >
                  <option value="pending">{t('bookings.status.pending')}</option>
                  <option value="confirmed">{t('bookings.status.confirmed')}</option>
                  <option value="cancelled">{t('bookings.status.cancelled')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bookings.paymentStatusTitle')}
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => onPaymentStatusChange?.(id, e.target.value as PaymentStatus)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                >
                  <option value="pending">{t('bookings.paymentStatus.pending')}</option>
                  <option value="paid">{t('bookings.paymentStatus.paid')}</option>
                  <option value="refunded">{t('bookings.paymentStatus.refunded')}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleDelete}
                color="danger"
                variant="bordered"
                size="md"
                className="border-2 hover:bg-red-50 hover:border-red-600 hover:text-red-700 shadow-sm hover:shadow-red-500/10 transition-all duration-200"
              >
                {t('common.delete')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 