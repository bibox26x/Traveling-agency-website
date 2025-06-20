import React from 'react';
import OptimizedImage from './OptimizedImage';
import LazyLoad from './LazyLoad';
import type { ImageProps } from 'next/image';

/**
 * LazyLoadImage extends OptimizedImage with advanced lazy loading capabilities.
 * 
 * Best used for:
 * - Lists and grids of images (e.g., trip/destination cards)
 * - Below-the-fold content
 * - When you need container/aspect ratio management
 * - When you want built-in loading animations
 * - Image-heavy pages
 * 
 * For hero sections or above-the-fold content, use OptimizedImage instead.
 */
interface LazyLoadImageProps extends Omit<ImageProps, 'loading'> {
  aspectRatio?: number;
  containerClassName?: string;
}

export default function LazyLoadImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  containerClassName,
  className,
  fill,
  priority,
  ...props
}: LazyLoadImageProps) {
  // If fill is true, we need to ensure the container has relative positioning
  const containerStyle = fill
    ? { position: 'relative' as const, height: '100%', width: '100%' }
    : aspectRatio
    ? {
        position: 'relative' as const,
        paddingTop: `${(1 / aspectRatio) * 100}%`,
      }
    : undefined;

  const imageComponent = (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${fill ? 'absolute inset-0' : ''}`}
      loading={priority ? undefined : 'lazy'}
      priority={priority}
      fill={fill}
      {...props}
    />
  );

  // If priority is true, don't use LazyLoad wrapper
  if (priority) {
    return (aspectRatio || fill) ? (
      <div 
        style={containerStyle} 
        className={`relative ${containerClassName} ${fill ? 'h-full w-full' : ''}`}
      >
        {imageComponent}
      </div>
    ) : (
      imageComponent
    );
  }

  // If fill is true, use container dimensions for placeholder
  const placeholderHeight = fill ? '100%' : height || (aspectRatio && typeof width === 'number' ? width / aspectRatio : undefined);
  const placeholderWidth = fill ? '100%' : width;

  return (
    <LazyLoad
      height={placeholderHeight}
      width={placeholderWidth}
      className={`${containerClassName} ${fill ? 'relative h-full w-full' : ''}`}
      placeholder={
        <div
          style={containerStyle}
          className="bg-gray-200 animate-pulse rounded overflow-hidden"
        />
      }
    >
      {(aspectRatio || fill) ? (
        <div style={containerStyle} className="relative">
          {imageComponent}
        </div>
      ) : (
        imageComponent
      )}
    </LazyLoad>
  );
} 