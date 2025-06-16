import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  publicRoute?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, publicRoute = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading) {
      if (!publicRoute && !user) {
        // Redirect to login for protected routes when not authenticated
        const redirect = router.pathname !== '/' ? `?redirect=${router.pathname}` : '';
        router.replace(`/login${redirect}`);
      } else if (adminOnly && (!user || user.role !== 'ADMIN')) {
        // Redirect non-admin users from admin-only routes
        router.replace('/');
      }
    }
  }, [router, user, loading, adminOnly, publicRoute]);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // For public routes or authenticated users, render the children
  if (publicRoute || user) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
}
