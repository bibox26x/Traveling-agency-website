import axios from 'axios';
import { Destination } from '../types/destination';
import { Trip } from '../types/trip';
import { BookingStatus, PaymentStatus, PaymentMethod, Booking, Payment, CreateBookingRequest } from '../types/booking';

// Create a debouncer for refresh token requests
let refreshPromise: Promise<any> | null = null;
const clearRefreshPromise = () => {
  refreshPromise = null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // Check if there's a new access token in the response headers
    const newToken = response.headers['authorization'];
    if (newToken) {
      const token = newToken.split(' ')[1];
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If refresh token request fails, logout
    if (error.response?.status === 401 && originalRequest.url?.includes('/auth/refresh')) {
      await auth.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login?redirect=' + window.location.pathname;
      }
      return Promise.reject(error);
    }

    // Prevent infinite refresh loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use existing refresh promise if one is in progress
        if (!refreshPromise) {
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          refreshPromise = auth.refreshToken(rememberMe)
            .finally(clearRefreshPromise);
        }

        const response = await refreshPromise;
        const { accessToken, user } = response;
        
        if (accessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
        
        // If no access token in response, redirect to login
        await auth.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=' + window.location.pathname;
        }
        return Promise.reject(error);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        await auth.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=' + window.location.pathname;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      const { accessToken, user } = response.data;
      if (!accessToken || !user) {
        throw new Error('Invalid response from server');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', String(rememberMe));
      }
      return { accessToken, user };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to login');
      }
    }
  },

  register: async (name: string, email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, rememberMe });
      const { accessToken, user } = response.data;
      if (!accessToken || !user) {
        throw new Error('Invalid response from server');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', String(rememberMe));
      }
      return { accessToken, user };
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Email already exists');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to register');
      }
    }
  },

  refreshToken: async (rememberMe: boolean = false) => {
    try {
      const response = await api.post('/auth/refresh', { rememberMe });
      return response.data;
    } catch (error) {
      // Clear any existing tokens on refresh failure
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      }
      throw error;
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

// Trips API
export const trips = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get('/trips');
    return response.data;
  },
  getById: async (id: number): Promise<Trip> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (data: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    duration: number;
    price: number;
    imageUrl?: string;
    destinationId: number;
  }): Promise<Trip> => {
    const response = await api.post('/trips', data);
    return response.data;
  },
  update: async (id: number, data: Partial<{
    title: string;
    description: string;
    location: string;
    startDate: string;
    duration: number;
    price: number;
    imageUrl: string;
    destinationId: number;
  }>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
  getDestinations: async (): Promise<Destination[]> => {
    const response = await api.get('/destinations');
    return response.data;
  }
};

// Bookings API
export const bookings = {
  create: async (tripId: number, guests: number, specialRequirements?: string): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', { tripId, guests, specialRequirements });
    return response.data;
  },
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },
  cancel: async (bookingId: number): Promise<Booking> => {
    const response = await api.delete<Booking>(`/bookings/${bookingId}`);
    return response.data;
  },
  updateStatus: async (bookingId: number, status: BookingStatus): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },
  updatePaymentStatus: async (bookingId: number, paymentStatus: PaymentStatus): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${bookingId}/payment-status`, { paymentStatus });
    return response.data;
  },
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/admin/bookings');
    return response.data;
  }
};

// Payments API
export const payments = {
  create: async (data: {
    bookingId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    proofImage: string;
  }): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },
  getByBooking: async (bookingId: number): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments/booking/${bookingId}`);
    return response.data;
  },
  getUserPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },
  updateStatus: async (
    paymentId: number,
    status: 'pending' | 'confirmed' | 'rejected',
    adminNote?: string
  ): Promise<Payment> => {
    const response = await api.patch<Payment>(`/payments/${paymentId}/status`, { status, adminNote });
    return response.data;
  },
  confirmPayment: async (paymentId: number, adminNote?: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${paymentId}/confirm`, { adminNote });
    return response.data;
  }
};

export default api; 