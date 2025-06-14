import React, { useState, useMemo } from 'react';
import type { Trip } from '../../types/trip';

interface Props {
  trip?: Trip;
  destinations?: Array<{ id: number; name: string }>;
  onSubmit: (tripData: Partial<Trip>) => Promise<void>;
  onCancel: () => void;
}

type TripField = keyof Trip;

export default function TripForm({ trip, destinations = [], onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<Partial<Trip>>({
    title: trip?.title || '',
    description: trip?.description || '',
    location: trip?.location || '',
    price: trip?.price || 0,
    startDate: trip?.startDate || '',
    duration: trip?.duration || 1,
    imageUrl: trip?.imageUrl || '',
    destinationId: trip?.destinationId || undefined
  });

  // Calculate end date based on start date and duration
  const calculatedEndDate = useMemo(() => {
    if (!formData.startDate || !formData.duration) return '';
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (formData.duration - 1)); // -1 because duration includes start date
    return endDate.toISOString().split('T')[0];
  }, [formData.startDate, formData.duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields: TripField[] = ['title', 'description', 'location', 'price', 'startDate', 'duration'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Convert numeric fields
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      destinationId: formData.destinationId ? Number(formData.destinationId) : null
    };

    await onSubmit(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration'
        ? Number(value)
        : name === 'destinationId'
          ? value === '' ? null : Number(value)
          : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
          <input
            type="text"
            name="title"
          id="title"
            value={formData.title}
            onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
          <input
            type="text"
            name="location"
          id="location"
            value={formData.location}
            onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
        <label htmlFor="destinationId" className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <select
          name="destinationId"
          id="destinationId"
          value={formData.destinationId === null ? '' : formData.destinationId || ''}
            onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Select a destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>
        </div>

        <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price *
        </label>
          <input
            type="number"
          name="price"
          id="price"
          value={formData.price}
            onChange={handleChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (days) *
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date (calculated)
          </label>
          <input
            type="date"
            value={calculatedEndDate}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
          <input
          type="url"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {trip ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
} 