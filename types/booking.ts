import { Trip } from './trip';
import { User } from './user';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'bank_transfer';

export interface Booking {
  id: number;
  tripId: number;
  userId: number;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequirements?: string;
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  trip?: Trip;
  user?: User;
}

export interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  proofImage?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  adminNote?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  booking: Booking;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateBookingRequest {
  tripId: number;
  guests: number;
  specialRequirements?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
} 