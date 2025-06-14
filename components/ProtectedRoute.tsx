import { useRouter } from 'next/router';
import React from 'react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // In a real app, decode token or fetch user role
    if (!token) {
      router.replace('/login');
    } else if (adminOnly) {
      // TODO: Replace with real admin check
      const isAdmin = false;
      if (!isAdmin) router.replace('/');
    }
  }, [router, adminOnly]);
  return <>{children}</>;
}
