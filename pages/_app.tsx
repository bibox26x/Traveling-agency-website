import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '../context/AuthContext';
import DirectionLayout from '../components/layout/DirectionLayout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DirectionLayout>
        <Component {...pageProps} />
      </DirectionLayout>
    </AuthProvider>
  );
}

const AppWithTranslation = appWithTranslation(MyApp);

// Import i18n after wrapping with appWithTranslation
import '../i18n';

export default AppWithTranslation;
