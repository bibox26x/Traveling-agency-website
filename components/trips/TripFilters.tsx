import { useState, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import type { TripFilters } from '../../types/trip';
import clsx from 'clsx';

interface Props {
  onFilterChange: (filters: TripFilters) => void;
}

export default function TripFilters({ onFilterChange }: Props) {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const [filters, setFilters] = useState<TripFilters>({
    searchQuery: '',
    location: '',
    minPrice: 0,
    maxPrice: 0,
    startDate: '',
    endDate: ''
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: TripFilters) => {
      const newFilters = { 
        ...prev, 
        [name]: name === 'minPrice' || name === 'maxPrice' ? Number(value) || 0 : value 
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.search')}
          </label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder={t('filters.searchPlaceholder')}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.location')}
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder={t('filters.locationPlaceholder')}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.minPrice')}
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
            placeholder={t('filters.minPricePlaceholder')}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.maxPrice')}
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
            placeholder={t('filters.maxPricePlaceholder')}
            className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.startDate')}
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className={clsx(
              "block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition",
              isRTL && "text-right"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.endDate')}
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className={clsx(
              "block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition",
              isRTL && "text-right"
            )}
          />
        </div>
      </div>
    </div>
  );
} 