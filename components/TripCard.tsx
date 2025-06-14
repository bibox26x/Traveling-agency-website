import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Trip } from '../types/trip';

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

  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (duration - 1));
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-white">
      <div className="relative h-72 w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transform transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
            <span className="text-6xl text-white drop-shadow-lg">✈️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm text-secondary-600 font-semibold px-4 py-2 rounded-full shadow-lg">
            From ${price.toLocaleString()}
          </div>
        </div>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-6 px-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">📍</span>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-secondary-500 transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        <p className="text-lg font-medium text-gray-700 mb-3 text-center">
          {location}
        </p>

        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <div className="bg-secondary-50 px-4 py-2 rounded-full text-secondary-700 font-medium text-sm flex items-center">
            <span className="mr-2">🗓️</span>
            {formattedStartDate} - {formattedEndDate}
          </div>
          <div className="bg-secondary-50 px-4 py-2 rounded-full text-secondary-700 font-medium text-sm flex items-center">
            <span className="mr-2">⏱️</span>
            {duration} {duration === 1 ? 'day' : 'days'}
          </div>
        </div>

        <div className="pb-6">
          <Link
            href={`/trips/${id}`}
            className="block w-full bg-gradient-to-r from-secondary-500 to-secondary-400 text-white py-3 px-6 rounded-xl text-lg font-semibold text-center shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 group"
          >
            View Trip Details
            <svg 
              className="w-6 h-6 ml-2 inline-block transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 