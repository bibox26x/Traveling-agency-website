import { Trip } from './trip';

export interface Destination {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  country: string;
  trips: Trip[];
  createdAt: string;
  updatedAt: string;
} 