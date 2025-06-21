import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Trip } from '../../types/trip';
import LazyLoadImage from '../ui/LazyLoadImage';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const { t } = useTranslation('common');

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <LazyLoadImage
          src={trip.imageUrl || '/images/placeholder.jpg'}
          alt={trip.title}
            fill
          className="object-cover transform transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          containerClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300" />
        <div className="absolute right-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-primary-900 shadow-lg">
          {t('common.fromPrice', { price: trip.price })}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
        <p className="mt-2 text-sm text-gray-500">
          {t('common.duration', { duration: trip.duration })}
        </p>
        <p className="mt-4 text-base text-gray-600 line-clamp-2">
          {trip.description}
        </p>
    </div>
    </Link>
  );
} 