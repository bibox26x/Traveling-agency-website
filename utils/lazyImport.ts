import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface LazyComponentProps {
  [key: string]: any;
}

interface LazyLoadOptions {
  ssr?: boolean;
}

export function lazyImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = { ssr: true }
): T {
  return dynamic(importFn, {
    loading: () => null,
    ssr: options.ssr,
  }) as T;
}

// Example usage:
// export const LazyComponent = lazyImport(() => import('../components/HeavyComponent')); 