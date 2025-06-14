import { Destination } from './destination';

export interface Trip {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  startDate: string;
  duration: number;
  imageUrl?: string;
  destinationId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  mealsIncluded: ('breakfast' | 'lunch' | 'dinner')[];
}

export interface TripFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface BookingRequest {
  tripId: number;
  guests: number;
  specialRequirements?: string;
}

export interface Booking {
  id: number;
  tripId: number;
  userId: number;
  guests: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  createdAt: string;
  trip: Trip;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded'; 