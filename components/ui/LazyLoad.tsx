import React from 'react';
import { useLazyLoad } from '../../hooks/useLazyLoad';

interface LazyLoadProps {
  children: React.ReactNode;
  height?: string | number;
  width?: string | number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
  onVisible?: () => void;
}

export default function LazyLoad({
  children,
  height = 'auto',
  width = 'auto',
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  onVisible,
}: LazyLoadProps) {
  const [isVisible, ref] = useLazyLoad({ threshold, rootMargin });

  React.useEffect(() => {
    if (isVisible && onVisible) {
      onVisible();
    }
  }, [isVisible, onVisible]);

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    minHeight: typeof height === 'number' ? `${height}px` : height,
    minWidth: typeof width === 'number' ? `${width}px` : width,
    position: 'relative' as const,
  };

  return (
    <div
      ref={ref}
      style={containerStyle}
      className={`${className} overflow-hidden`}
    >
      {isVisible ? children : placeholder || <div className="animate-pulse bg-gray-200 h-full w-full rounded" />}
    </div>
  );
} 