import axios from 'axios';
import { Destination } from '../types/destination';
import { Trip } from '../types/trip';
import { BookingStatus, PaymentStatus, PaymentMethod, Booking, Payment, CreateBookingRequest } from '../types/booking';

// Create a debouncer for refresh token requests
let refreshPromise: Promise<any> | null = null;
const clearRefreshPromise = () => {
  refreshPromise = null;
};

// Get the base URL from environment or default to relative path
const baseURL = typeof window !== 'undefined' 
  ? ''  // Use empty string for client-side since Next.js handles the routing
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'; // Use full URL for server-side

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Important: Send cookies with requests
});

// Add /api prefix to all requests
api.interceptors.request.use((config) => {
  if (!config.url?.startsWith('/api')) {
    config.url = `/api${config.url}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't attempt refresh if we're on the server side
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // If refresh token request fails, handle logout
    if (error.response?.status === 401 && originalRequest.url?.includes('/auth/refresh')) {
      clearRefreshPromise(); // Clear any pending refresh promise
      return Promise.reject(error);
    }

    // If error is 401 and not a refresh token request, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use the debounced refresh token mechanism
        await auth.refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        clearRefreshPromise(); // Clear any pending refresh promise
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
      const response = await api.post('/auth/login', { email, password, rememberMe }, {
        withCredentials: true
      });
      return response.data;
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
      const response = await api.post('/auth/register', { name, email, password, rememberMe }, {
        withCredentials: true
      });
      return response.data;
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

  refreshToken: async () => {
    // Use debouncing to prevent multiple concurrent refresh requests
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await api.post('/auth/refresh', {}, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        // Clear the promise after a short delay to prevent immediate subsequent requests
        setTimeout(clearRefreshPromise, 1000);
      }
    })();

    return refreshPromise;
  },

  logout: async () => {
    try {
      // Clear any pending refresh operations
      clearRefreshPromise();
      
      // Make the logout request
      await api.post('/auth/logout', {}, {
        withCredentials: true
      });

      // Clear all auth-related cookies manually as backup
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear cookies even if the API call fails
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      throw error;
    }
  },

  // Add a method to check auth status without triggering a refresh
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/status', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
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

// Admin API
export const admin = {
  // Booking Management
  getAllBookings: async (filters?: {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/admin/bookings?${params.toString()}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId: number, status: BookingStatus): Promise<Booking> => {
    const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (bookingId: number, paymentStatus: PaymentStatus): Promise<Booking> => {
    const response = await api.patch(`/admin/bookings/${bookingId}/payment-status`, { paymentStatus });
    return response.data;
  },

  deleteBooking: async (bookingId: number): Promise<void> => {
    await api.delete(`/admin/bookings/${bookingId}`);
  },

  // Payment Management
  getAllPayments: async (filters?: {
    status?: 'pending' | 'confirmed' | 'rejected';
    search?: string;
  }): Promise<Payment[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/admin/payments?${params.toString()}`);
    return response.data;
  },

  confirmPayment: async (paymentId: number, adminNote?: string): Promise<Payment> => {
    const response = await api.post(`/admin/payments/${paymentId}/confirm`, { adminNote });
    return response.data;
  },

  rejectPayment: async (paymentId: number, adminNote: string): Promise<Payment> => {
    const response = await api.post(`/admin/payments/${paymentId}/reject`, { adminNote });
    return response.data;
  }
};

export default api; 