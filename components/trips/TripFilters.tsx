import React, { useState } from 'react';
import type { TripFilters } from '../../types/trip';

interface Props {
  onFilterChange: (filters: TripFilters) => void;
}

export default function TripFilters({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<TripFilters>({
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    startDate: '',
    endDate: '',
    difficulty: undefined,
    searchQuery: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value === '' ? undefined : 
        (name === 'minPrice' || name === 'maxPrice') ? Number(value) : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery || ''}
            onChange={handleChange}
            placeholder="Search trips..."
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location || ''}
            onChange={handleChange}
            placeholder="Enter location"
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            name="difficulty"
            value={filters.difficulty || ''}
            onChange={handleChange}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min price"
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max price"
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleChange}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
} 