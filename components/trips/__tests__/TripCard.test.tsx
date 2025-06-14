import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import TripCard from '../TripCard';
import type { Trip } from '../../../types/trip';

const mockTrip: Trip = {
  id: 1,
  title: 'Test Trip',
  location: 'Test Location',
  description: 'Test Description',
  price: 1000,
  startDate: '2024-01-01',
  endDate: '2024-01-07',
  imageUrl: 'https://example.com/image.jpg',
  capacity: 10,
  maxParticipants: 10,
  currentParticipants: 5,
  difficultyLevel: 'moderate',
  destinationId: 1,
  createdById: 1,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  includedServices: ['Service 1', 'Service 2'],
  itinerary: [
    {
      day: 1,
      title: 'Day 1',
      description: 'Day 1 Description',
      activities: ['Activity 1'],
      accommodation: 'Hotel',
      mealsIncluded: ['breakfast', 'dinner']
    }
  ],
  cancellationPolicy: 'Free cancellation up to 24 hours before the trip'
};

describe('TripCard', () => {
  it('renders trip information correctly', () => {
    render(<TripCard trip={mockTrip} />);

    // Check if basic trip information is rendered
    expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.location)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockTrip.price}`)).toBeInTheDocument();

    // Check if dates are rendered
    const startDate = new Date(mockTrip.startDate).toLocaleDateString();
    const endDate = new Date(mockTrip.endDate).toLocaleDateString();
    expect(screen.getByText(`${startDate} - ${endDate}`)).toBeInTheDocument();

    // Check if difficulty level is rendered
    expect(screen.getByText('Moderate')).toBeInTheDocument();

    // Check if spots left information is rendered
    const spotsLeft = mockTrip.maxParticipants - mockTrip.currentParticipants;
    expect(screen.getByText(`${spotsLeft} spots left`)).toBeInTheDocument();

    // Check if the link to trip details is present
    const detailsLink = screen.getByRole('link', { name: /view details/i });
    expect(detailsLink).toHaveAttribute('href', `/trips/${mockTrip.id}`);
  });

  it('renders placeholder image when no image URL is provided', () => {
    const tripWithoutImage = { ...mockTrip, imageUrl: undefined };
    render(<TripCard trip={tripWithoutImage} />);

    // Check if emoji placeholder is rendered
    expect(screen.getByText('✈️')).toBeInTheDocument();
  });

  it('applies correct color coding for different difficulty levels', () => {
    // Test easy difficulty
    const easyTrip = { ...mockTrip, difficultyLevel: 'easy' as const };
    const { rerender } = render(<TripCard trip={easyTrip} />);
    const easyBadge = screen.getByText('Easy');
    expect(easyBadge).toHaveClass('bg-green-100', 'text-green-800');

    // Test moderate difficulty
    rerender(<TripCard trip={mockTrip} />);
    const moderateBadge = screen.getByText('Moderate');
    expect(moderateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');

    // Test challenging difficulty
    const challengingTrip = { ...mockTrip, difficultyLevel: 'challenging' as const };
    rerender(<TripCard trip={challengingTrip} />);
    const challengingBadge = screen.getByText('Challenging');
    expect(challengingBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('applies correct color coding for spots left indicator', () => {
    // Test low availability (less than 5 spots)
    const lowAvailabilityTrip = { ...mockTrip, maxParticipants: 10, currentParticipants: 7 };
    const { rerender } = render(<TripCard trip={lowAvailabilityTrip} />);
    const lowAvailabilityIndicator = screen.getByText('3 spots left');
    expect(lowAvailabilityIndicator).toHaveClass('bg-red-50', 'text-red-700');

    // Test good availability (5 or more spots)
    rerender(<TripCard trip={mockTrip} />);
    const goodAvailabilityIndicator = screen.getByText('5 spots left');
    expect(goodAvailabilityIndicator).toHaveClass('bg-green-50', 'text-green-700');
  });
}); 