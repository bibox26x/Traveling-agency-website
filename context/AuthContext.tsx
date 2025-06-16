import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { auth } from '../services/api';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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

// Token refresh cooldown period (14 minutes - just before the 15-minute access token expiry)
const REFRESH_COOLDOWN = 14 * 60 * 1000;

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/about', '/destinations', '/trips'];

// Add refresh lock
let isRefreshing = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const router = useRouter();
  
  // Add refs to track auth state
  const isAuthenticating = useRef(false);
  const refreshTimeout = useRef<NodeJS.Timeout>();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.some(route => 
      path === route || 
      path.startsWith(`${route}/`) ||
      // Handle dynamic routes
      (route !== '/' && path.match(new RegExp(`^${route}/[^/]+$`)))
    );
  };

  const handleLogout = async (silent: boolean = false) => {
    // Prevent multiple logout attempts and check if mounted
    if (!mounted.current) return;
    
    // Clear refresh timeout immediately
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = undefined;
    }

    try {
      // Make the logout request first
      await auth.logout();
      
      // Then clear the state
      setUser(null);
      setLastRefresh(0);
      isRefreshing = false; // Reset the refresh lock
      
      // Only redirect if not silent and not on a public route
      if (!silent && !isPublicRoute(router.pathname)) {
        const currentPath = router.pathname;
        const redirect = currentPath !== '/' ? `?redirect=${currentPath}` : '';
        router.replace(`/login${redirect}`);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear state even if the API call fails
      setUser(null);
      setLastRefresh(0);
      isRefreshing = false;
      
      // Still redirect if not silent
      if (!silent && !isPublicRoute(router.pathname)) {
        const currentPath = router.pathname;
        const redirect = currentPath !== '/' ? `?redirect=${currentPath}` : '';
        router.replace(`/login${redirect}`);
      }
    }
  };

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticating.current) return;
      isAuthenticating.current = true;

      try {
        console.log('Initializing auth check for path:', router.pathname);
        
        // Always check auth status first
        try {
          const statusResponse = await auth.checkAuth();
          if (statusResponse.user && mounted.current) {
            setUser(statusResponse.user);
            setLastRefresh(Date.now());
            console.log('Found existing session:', statusResponse.user);
            return;
          }
        } catch (statusError) {
          console.log('No valid session found, trying refresh');
          
          // Only try refresh token if not on a public route
          if (!isPublicRoute(router.pathname)) {
            try {
              const response = await auth.refreshToken();
              if (response.user && mounted.current) {
                setUser(response.user);
                setLastRefresh(Date.now());
                console.log('Restored session via refresh:', response.user);
              }
            } catch (error) {
              console.log('No valid session found');
              await handleLogout(true); // Silent logout
            }
          }
        }
      } catch (error) {
        console.error('Initial auth check failed:', error);
        await handleLogout(true); // Silent logout
      } finally {
        isAuthenticating.current = false;
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [router.pathname]);

  // Set up periodic token refresh
  useEffect(() => {
    if (!user) {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      // Schedule refresh for 1 minute before token expiry
      const REFRESH_MARGIN = 60000; // 1 minute
      const nextRefresh = REFRESH_COOLDOWN - REFRESH_MARGIN;

      refreshTimeout.current = setTimeout(async () => {
        if (!mounted.current || !user) return;

        try {
          if (!isPublicRoute(router.pathname)) {
            await checkAuth();
          }
          scheduleRefresh(); // Schedule next refresh only if still mounted and authenticated
        } catch (error) {
          console.error('Periodic refresh failed:', error);
        }
      }, nextRefresh);
    };

    scheduleRefresh();

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [user, router.pathname]);

  const checkAuth = async () => {
    if (isRefreshing || isAuthenticating.current || !mounted.current) return;
    isRefreshing = true;

    try {
      const now = Date.now();
      if (now - lastRefresh >= REFRESH_COOLDOWN) {
        const response = await auth.refreshToken();
        if (response.user && mounted.current) {
          setUser(response.user);
          setLastRefresh(now);
        } else {
          await handleLogout(true); // Silent logout
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await handleLogout(true); // Silent logout
    } finally {
      isRefreshing = false;
    }
  };

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      setError(null);
      const response = await auth.login(email, password, remember);
      setUser(response.user);
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
      const response = await auth.register(name, email, password, remember);
      setUser(response.user);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
