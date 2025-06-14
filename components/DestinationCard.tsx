import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { Destination } from '../types/destination';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <Card className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover transform transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 transition-opacity duration-300" />
        
        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-6 px-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">📍</span>
            <h3 className="text-2xl font-display font-bold text-gray-900 group-hover:text-secondary-500 transition-colors">
              {destination.name}
            </h3>
          </div>
        </div>
      </div>

      <CardBody className="relative z-10 px-6 pt-6">
        <p className="text-lg font-medium text-gray-700 mb-3">
          {destination.country}
        </p>
        
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {destination.description}
        </p>
      </CardBody>

      <CardFooter className="bg-white px-6 pb-6 pt-0">
        <Link
          href={`/destinations/${destination.id}`}
          className="block w-full bg-gradient-to-r from-secondary-500 to-secondary-400 text-white py-3 px-6 rounded-xl text-lg font-semibold text-center shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 group"
        >
          Explore Destination
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
      </CardFooter>
    </Card>
  );
};

export default DestinationCard; 