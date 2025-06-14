import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/api';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;  // Changed from 'USER' | 'ADMIN' to allow any case
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token refresh cooldown period (2 minutes - less than the 5-minute token expiry)
const REFRESH_COOLDOWN = 2 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up periodic token refresh
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Periodic refresh failed:', error);
      }
    }, REFRESH_COOLDOWN);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      const rememberedState = localStorage.getItem('rememberMe');

      if (!token || !userData) {
        await handleLogout();
        return;
      }

      // Check if we need to refresh the token
      const now = Date.now();
      const shouldRefresh = now - lastRefresh >= REFRESH_COOLDOWN;

      if (shouldRefresh) {
        try {
          const response = await auth.refreshToken(rememberedState === 'true');
          if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            if (response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
              setUser(response.user);
            }
            setLastRefresh(now);
          } else {
            throw new Error('No access token in refresh response');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          await handleLogout();
          throw error;
        }
      } else {
        // Parse and validate user data
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.id && parsedUser.role) {
            setUser(parsedUser);
            setRememberMe(rememberedState === 'true');
          } else {
            throw new Error('Invalid user data');
          }
        } catch (e) {
          console.error('Invalid user data in localStorage:', e);
          await handleLogout();
          throw e;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await handleLogout();
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setLastRefresh(0);
      setRememberMe(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      
      // Only redirect to login if we're not already there and not on the home page
      if (!router.pathname.includes('/login') && router.pathname !== '/') {
        const redirect = router.pathname !== '/' ? `?redirect=${router.pathname}` : '';
        router.push(`/login${redirect}`);
      }
    }
  };

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      setError(null);
      const { accessToken, user } = await auth.login(email, password, remember);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rememberMe', String(remember));
      setUser(user);
      setRememberMe(remember);
      setLastRefresh(Date.now());
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, remember: boolean = false) => {
    try {
      setError(null);
      const { accessToken, user } = await auth.register(name, email, password, remember);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rememberMe', String(remember));
      setUser(user);
      setRememberMe(remember);
      setLastRefresh(Date.now());
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to register. Please try again.';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
