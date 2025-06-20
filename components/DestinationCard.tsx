import React from 'react';
import Link from 'next/link';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { useTranslation } from 'next-i18next';
import { Destination } from '../types/destination';
import clsx from 'clsx';
import LazyLoadImage from './ui/LazyLoadImage';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  return (
    <Link 
      href={`/destinations/${destination.id}`}
      className="block group cursor-pointer"
    >
      <Card className="group/card relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="relative h-72 w-full overflow-hidden">
          <LazyLoadImage
            src={destination.imageUrl || '/images/placeholder.jpg'}
            alt={destination.name}
            fill
            className="object-cover transform transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            containerClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 transition-opacity duration-300" />
          
          {/* Location Pin */}
          <div className={clsx(
            "absolute top-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2",
            isRTL ? "left-4" : "right-4"
          )}>
            <div className={clsx(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className="text-xl">📍</span>
              <span className={clsx(
                "text-lg font-medium text-gray-900",
                isRTL && "font-arabic"
              )}>
                {destination.name}
              </span>
            </div>
          </div>
        </div>

        <CardBody className="relative z-10 px-6 pt-6">
          <p className={clsx(
            "text-lg font-medium text-gray-700 mb-3",
            isRTL && "text-right font-arabic"
          )}>
            {destination.country}
          </p>
          
          <p className={clsx(
            "text-gray-600 mb-6 line-clamp-3 leading-relaxed",
            isRTL && "text-right font-arabic"
          )}>
            {destination.description}
          </p>
        </CardBody>

        <CardFooter className="bg-white px-6 pb-6 pt-0">
          <button
            type="button"
            className={clsx(
              "block w-full bg-gradient-to-r from-secondary-500 to-secondary-400 text-white py-3 px-6 rounded-xl",
              "text-lg font-semibold text-center shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5",
              "active:translate-y-0 transform transition-all duration-300 group/btn relative z-10",
              isRTL && "font-arabic"
            )}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/destinations/${destination.id}`;
            }}
          >
            <div className={clsx(
              "flex items-center justify-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              {t('destinations.exploreDestination')}
              <svg 
                className={clsx(
                  "w-6 h-6 transform transition-transform",
                  isRTL ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"
                )}
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
            </div>
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DestinationCard; 