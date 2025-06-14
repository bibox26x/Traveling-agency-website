import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function RequireAuth({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (adminOnly && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, adminOnly, router]);
  return <>{user && (!adminOnly || user.role === 'admin') ? children : null}</>;
}
