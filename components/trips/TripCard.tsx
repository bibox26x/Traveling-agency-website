import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Trip } from '../../types/trip';

interface Props {
  trip: Trip;
}

export default function TripCard({ trip }: Props) {
  const {
    id,
    title,
    location,
    description,
    price,
    startDate,
    duration,
    imageUrl,
  } = trip;

  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (duration - 1));
  const formattedEndDate = endDate.toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
            <span className="text-5xl text-white font-bold drop-shadow">✈️</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-1 text-blue-700">{title}</h3>
        <p className="text-gray-500 mb-2 font-medium">{location}</p>
        <p className="mb-3 text-gray-700 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
          <span className="bg-blue-50 px-2 py-1 rounded">
            {formattedStartDate} - {formattedEndDate}
          </span>
          <span className="bg-blue-50 px-2 py-1 rounded">
            {duration} {duration === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${price}</span>
          <Link
            href={`/trips/${id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 