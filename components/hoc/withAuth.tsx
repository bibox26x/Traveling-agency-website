import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { ComponentType } from 'react';
import { auth } from '../../services/api';

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  adminRequired: boolean = false
) {
  return function WithAuthComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
      let mounted = true;

      const checkAuth = async () => {
        try {
          // Try to verify auth status without triggering a refresh
          const status = await auth.checkAuth();
          if (!mounted) return;

          if (status.user) {
            setAuthChecked(true);
            if (adminRequired && status.user.role?.toUpperCase() !== 'ADMIN') {
              setIsRedirecting(true);
              router.replace('/');
            }
          } else {
            setIsRedirecting(true);
            const currentPath = router.pathname;
            const redirect = currentPath !== '/' ? `?redirect=${currentPath}` : '';
            router.replace(`/login${redirect}`);
          }
        } catch (error) {
          if (!mounted) return;
          console.error('Auth check failed:', error);
          
          // Only redirect if we're not already on the login page
          if (!router.pathname.startsWith('/login')) {
            setIsRedirecting(true);
            const currentPath = router.pathname;
            const redirect = currentPath !== '/' ? `?redirect=${currentPath}` : '';
            router.replace(`/login${redirect}`);
          }
        }
      };

      // Only check auth if loading is complete and we haven't checked yet
      if (!loading && !authChecked && !isRedirecting) {
        checkAuth();
      }

      return () => {
        mounted = false;
      };
    }, [loading, authChecked, router, isRedirecting]);

    // Show loading state while initial auth check is happening
    if (loading || !authChecked || isRedirecting) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    // Only render the component if we're authenticated and not redirecting
    return <WrappedComponent {...props} />;
  };
} 