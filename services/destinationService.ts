import api from './api';
import { Destination } from '../types/destination';

export const getAllDestinations = async (): Promise<Destination[]> => {
  const response = await api.get('/destinations');
  return response.data;
};

export const getDestinationById = async (id: number): Promise<Destination> => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

export const getDestinationTrips = async (id: number) => {
  const response = await api.get(`/destinations/${id}/trips`);
  return response.data;
};

export const createDestination = async (data: Omit<Destination, 'id' | 'trips' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/destinations', data);
  return response.data;
};

export const updateDestination = async (id: number, data: Partial<Omit<Destination, 'id' | 'trips' | 'createdAt' | 'updatedAt'>>) => {
  const response = await api.put(`/destinations/${id}`, data);
  return response.data;
};

export const deleteDestination = async (id: number) => {
  await api.delete(`/destinations/${id}`);
}; 