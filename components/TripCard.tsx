import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import type { Trip } from '../types/trip';
import clsx from 'clsx';
import { formatDateRange, calculateEndDate } from '../utils/dateUtils';

interface Props {
  trip: Trip;
}

export default function TripCard({ trip }: Props) {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
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

  const formattedDateRange = formatDateRange(startDate, calculateEndDate(new Date(startDate), duration).toISOString(), i18n.language);

  return (
    <Link 
      href={`/trips/${id}`}
      className="block group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-white">
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
              <span className="text-6xl text-white drop-shadow-lg" aria-hidden="true">{t('trips.card.icons.plane')}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 transition-opacity duration-300" />
          
          {/* Price Badge */}
          <div className={clsx(
            "absolute top-4",
            isRTL ? "left-4" : "right-4"
          )}>
            <div className={clsx(
              "bg-white/90 backdrop-blur-sm text-secondary-600 font-semibold px-4 py-2 rounded-full shadow-lg",
              isRTL && "font-arabic"
            )}>
              {t('common.fromPrice', { price: price.toLocaleString() })}
            </div>
          </div>

          {/* Location Pin */}
          <div className={clsx(
            "absolute top-20",
            isRTL ? "left-4" : "right-4"
          )}>
            <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2">
              <div className={clsx(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <span className="text-xl">📍</span>
                <span className={clsx(
                  "text-lg font-medium text-gray-900",
                  isRTL && "font-arabic"
                )}>
                  {location}
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className={clsx(
          "px-6 pt-6",
          isRTL && "text-right"
        )}>
          <h3 className={clsx(
            "text-2xl font-bold text-gray-900 mb-4 text-center",
            isRTL && "font-arabic"
          )}>
            {title}
          </h3>
          <p className={clsx(
            "text-gray-600 mb-6 line-clamp-3 leading-relaxed",
            isRTL && "font-arabic"
          )}>
            {description}
          </p>

          <div className={clsx(
            "flex flex-wrap gap-3 mb-6",
            isRTL ? "justify-end" : "justify-center"
          )}>
            <div className={clsx(
              "bg-secondary-50 px-4 py-2 rounded-full text-secondary-700 font-medium text-sm",
              "flex items-center gap-2",
              isRTL && "flex-row-reverse font-arabic"
            )}>
              <span aria-hidden="true">{t('trips.card.icons.calendar')}</span>
              {formattedDateRange}
            </div>
            <div className={clsx(
              "bg-secondary-50 px-4 py-2 rounded-full text-secondary-700 font-medium text-sm",
              "flex items-center gap-2",
              isRTL && "flex-row-reverse font-arabic"
            )}>
              <span aria-hidden="true">{t('trips.card.icons.duration')}</span>
              {duration} {t('units.duration')}
            </div>
          </div>

          <div className="pb-6">
            <button
              type="button"
              className={clsx(
                "block w-full bg-gradient-to-r from-secondary-500 to-secondary-400 text-white py-3 px-6 rounded-xl",
                "text-lg font-semibold text-center shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5",
                "active:translate-y-0 transform transition-all duration-300 group relative z-10",
                isRTL && "font-arabic"
              )}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/trips/${id}`;
              }}
            >
              <div className={clsx(
                "flex items-center justify-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                {t('trips.viewDetails')}
                <svg 
                  className={clsx(
                    "w-6 h-6 transform transition-transform",
                    isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
                  )}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 