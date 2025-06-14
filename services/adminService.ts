import api from './api';
import { Booking, Payment, BookingStatus, PaymentStatus } from '../types/booking';
import type { Trip } from '../types/trip';

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingPayments: number;
  confirmedPayments: number;
  recentBookings: Booking[];
  recentPayments: Payment[];
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Booking Management
  getAllBookings: async (filters?: {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/admin/bookings?${params.toString()}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId: number, status: BookingStatus) => {
    const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (bookingId: number, paymentStatus: PaymentStatus) => {
    const response = await api.patch(`/admin/bookings/${bookingId}/payment-status`, { paymentStatus });
    return response.data;
  },

  deleteBooking: async (bookingId: number) => {
    const response = await api.delete(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  updateBookingDestination: async (bookingId: number, destinationId: number) => {
    const response = await api.patch(`/admin/bookings/${bookingId}/destination`, { destinationId });
    return response.data;
  },

  // Payment Management
  getAllPayments: async (filters?: {
    status?: 'pending' | 'confirmed' | 'rejected';
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/admin/payments?${params.toString()}`);
    return response.data;
  },

  getPaymentsByStatus: async (status: 'pending' | 'confirmed' | 'rejected') => {
    const response = await api.get(`/admin/payments/status/${status}`);
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/admin/payments/stats');
    return response.data;
  },

  confirmPayment: async (paymentId: number, adminNote?: string) => {
    const response = await api.post(`/admin/payments/${paymentId}/confirm`, { adminNote });
    return response.data;
  },

  rejectPayment: async (paymentId: number, adminNote: string) => {
    const response = await api.post(`/admin/payments/${paymentId}/reject`, { adminNote });
    return response.data;
  },

  updateTripDestination: async (tripId: number, destinationId: number): Promise<Trip> => {
    const response = await api.patch(`/admin/trips/${tripId}/destination`, { destinationId });
    return response.data;
  }
}; 