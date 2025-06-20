import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { generateBlurDataUrl } from '../../utils/imageUtils';

/**
 * OptimizedImage is a lightweight wrapper around Next.js Image component.
 * 
 * Best used for:
 * - Hero sections and above-the-fold content
 * - Single, important images
 * - When priority loading is needed
 * - Simple image displays
 * - Performance-critical sections
 * 
 * For lists of images or below-the-fold content, consider using LazyLoadImage instead.
 */
interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  fallbackSrc?: string;
  lowQualityPlaceholder?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualityPlaceholder = true,
  quality = 75,
  loading,
  priority,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>();

  useEffect(() => {
    if (lowQualityPlaceholder && typeof src === 'string' && !priority) {
      generateBlurDataUrl(src).then(setBlurDataUrl);
    }
  }, [src, lowQualityPlaceholder, priority]);

  const loadingStrategy = priority ? undefined : (loading || 'lazy');

  if (error) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        loading={loadingStrategy}
        priority={priority}
        sizes={sizes}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      loading={loadingStrategy}
      priority={priority}
      sizes={sizes}
      className={className}
      placeholder={blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={blurDataUrl}
      onError={() => setError(true)}
      {...props}
    />
  );
} 