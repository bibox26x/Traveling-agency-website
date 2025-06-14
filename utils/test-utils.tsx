import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  reload: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  },
  beforePopState: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/'
};

// Reset all mocks before each test
beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  Object.keys(mockRouter).forEach(key => {
    const typedKey = key as keyof typeof mockRouter;
    if (typeof mockRouter[typedKey] === 'function') {
      (mockRouter[typedKey] as jest.Mock).mockReset();
    }
  });
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Custom render function
function render(ui: React.ReactElement, { route = '/', ...renderOptions } = {}) {
  // Update router mock with provided route
  (useRouter as jest.Mock).mockReturnValue({
    ...mockRouter,
    pathname: route,
    asPath: route
  });

  return rtlRender(ui, renderOptions);
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 