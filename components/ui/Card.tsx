import Link from 'next/link';
import { clsx } from 'clsx';
import { useTranslation } from 'next-i18next';
import LazyLoadImage from './LazyLoadImage';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  price?: string;
  duration?: string;
  rating?: number;
  href: string;
  className?: string;
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt,
  price,
  duration,
  rating,
  href,
  className,
}: CardProps) {
  const { t } = useTranslation('common');

  return (
    <Link
      href={href}
      className={clsx(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl',
        className
      )}
    >
      <div className="aspect-h-2 aspect-w-3 relative">
        <LazyLoadImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          aspectRatio={3/2}
        />
        {price && (
          <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900 shadow-md">
            {t('common.fromPrice', { price })}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary-900">{title}</h3>
          {duration && (
            <p className="mt-1 text-sm text-primary-600">
              <span className="font-medium">{duration}</span> {t('common.duration')}
            </p>
          )}
          <p className="mt-3 text-base text-gray-600 line-clamp-2">{description}</p>
        </div>
        {rating && (
          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((star) => (
                <svg
                  key={star}
                  className={clsx('h-5 w-5', {
                    'text-yellow-400': star < rating,
                    'text-gray-300': star >= rating,
                  })}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-600">
              {t('common.rating', { rating: rating.toFixed(1) })}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
} 