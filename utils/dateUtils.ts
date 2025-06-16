import { useRouter } from 'next/router';

export const formatDate = (dateString: string | Date, locale?: string): string => {
  const date = new Date(dateString);
  const currentLocale = locale || useRouter().locale || 'en';
  
  // Use Intl.DateTimeFormat for consistent formatting across locales
  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: currentLocale === 'ar' ? 'gregory' : undefined
  }).format(date);
};

export const formatDateRange = (startDate: string, endDate: string, locale?: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const currentLocale = locale || useRouter().locale || 'en';
  
  const dateFormatter = new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: currentLocale === 'ar' ? 'gregory' : undefined
  });
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const monthYearFormatter = new Intl.DateTimeFormat(currentLocale, {
      month: 'long',
      year: 'numeric',
      calendar: currentLocale === 'ar' ? 'gregory' : undefined
    });
    return `${start.getDate()} - ${end.getDate()} ${monthYearFormatter.format(start)}`;
  }
  
  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
};

export const formatRelativeDate = (dateString: string | Date, locale?: string): string => {
  const date = new Date(dateString);
  const currentLocale = locale || useRouter().locale || 'en';
  
  return new Intl.RelativeTimeFormat(currentLocale, {
    numeric: 'auto'
  }).format(
    Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};

export const getDurationInDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateEndDate = (startDate: Date, duration: number): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);
  return endDate;
}; 