import axios from 'axios';
import { Destination } from '../types/destination';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllDestinations = async (): Promise<Destination[]> => {
  const response = await axios.get(`${API_URL}/destinations`);
  return response.data;
};

export const getDestinationById = async (id: number): Promise<Destination> => {
  const response = await axios.get(`${API_URL}/destinations/${id}`);
  return response.data;
};

export const getDestinationTrips = async (id: number) => {
  const response = await axios.get(`${API_URL}/destinations/${id}/trips`);
  return response.data;
};

export const createDestination = async (data: Omit<Destination, 'id' | 'trips' | 'createdAt' | 'updatedAt'>) => {
  const response = await axios.post(`${API_URL}/destinations`, data);
  return response.data;
};

export const updateDestination = async (id: number, data: Partial<Omit<Destination, 'id' | 'trips' | 'createdAt' | 'updatedAt'>>) => {
  const response = await axios.put(`${API_URL}/destinations/${id}`, data);
  return response.data;
};

export const deleteDestination = async (id: number) => {
  await axios.delete(`${API_URL}/destinations/${id}`);
}; 