import { Trip } from './trip';

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
  bookingDate: string;
  specialRequirements?: string;
  trip: Trip;
  user: {
    id: number;
    name: string;
    email: string;
  };
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