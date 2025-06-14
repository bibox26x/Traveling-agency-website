import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { HeroUIProvider } from '@heroui/react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeroUIProvider>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </HeroUIProvider>
  );
}
