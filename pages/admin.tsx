import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { Trip } from '../types/trip';
import type { Destination } from '../types/destination';
import type { Booking, BookingStatus, PaymentStatus } from '../types/booking';
import TripForm from '../components/admin/TripForm';
import DestinationForm from '../components/admin/DestinationForm';
import AdminRoute from '../components/auth/AdminRoute';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/bookings/BookingCard';
import Head from 'next/head';
import { Button } from '@heroui/react';

export default function AdminPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'trips' | 'destinations' | 'bookings'>('trips');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [tripsRes, destinationsRes, bookingsRes] = await Promise.all([
          api.get('/trips'),
          api.get('/destinations'),
          api.get('/admin/bookings')
        ]);
        
        setTrips(tripsRes.data);
        setDestinations(destinationsRes.data);
        setBookings(bookingsRes.data);

        console.log('Fetched destinations:', destinationsRes.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load data. Please try again later.');
        
        setTrips([]);
        setDestinations([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Trip management handlers
  const handleAddTrip = async (tripData: Partial<Trip>) => {
    try {
      setError('');
      if (!user?.id) {
        throw new Error('User ID is required to create a trip');
      }
      const response = await api.post('/trips', {
        ...tripData,
        createdById: user.id
      });
      setTrips([...trips, response.data]);
      setIsAddingTrip(false);
    } catch (err: any) {
      console.error('Add trip error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to add trip');
    }
  };

  const handleUpdateTrip = async (tripData: Partial<Trip>) => {
    try {
      setError('');
      const response = await api.put(`/trips/${editingTrip?.id}`, tripData);
      setTrips(trips.map(trip => trip.id === editingTrip?.id ? response.data : trip));
      setEditingTrip(null);
    } catch (err: any) {
      console.error('Update trip error:', err);
      setError(err.response?.data?.error || 'Failed to update trip');
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      setError('');
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  // Destination management handlers
  const handleAddDestination = async (destinationData: Partial<Destination>) => {
    try {
      setError('');
      const response = await api.post('/admin/destinations', destinationData);
      setDestinations([...destinations, response.data]);
      setIsAddingDestination(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add destination');
    }
  };

  const handleUpdateDestination = async (destinationData: Partial<Destination>) => {
    try {
      setError('');
      const response = await api.put(`/admin/destinations/${editingDestination?.id}`, destinationData);
      setDestinations(destinations.map(dest => dest.id === editingDestination?.id ? response.data : dest));
      setEditingDestination(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update destination');
    }
  };

  const handleDeleteDestination = async (destinationId: number) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) {
      return;
    }

    try {
      setError('');
      await api.delete(`/admin/destinations/${destinationId}`);
      setDestinations(destinations.filter(dest => dest.id !== destinationId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete destination');
    }
  };

  const handleAssignTrip = async (destinationId: number, tripId: number) => {
    try {
      setError('');
      await api.post(`/admin/destinations/${destinationId}/trips`, { tripId });
      // Refresh data after assignment
      const [tripsRes, destinationsRes] = await Promise.all([
        api.get('/trips'),
        api.get('/destinations')
      ]);
      setTrips(tripsRes.data);
      setDestinations(destinationsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to assign trip to destination');
    }
  };

  const getDifficultyStyle = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const convertToNumber = (value: string | number | undefined): number | null => {
    if (typeof value === 'number') return value;
    if (!value) return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  };

  const handleViewTrip = (tripId: number) => {
    router.push(`/trips/${tripId.toString()}`);
  };

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setError('');
    } catch (err: any) {
      console.error('Update status error:', err);
      setError(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const handlePaymentStatusChange = async (bookingId: number, newStatus: PaymentStatus) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}/payment-status`, { status: newStatus });
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, paymentStatus: newStatus } : booking
        )
      );
      setError('');
    } catch (err: any) {
      console.error('Update payment status error:', err);
      setError(err.response?.data?.error || 'Failed to update payment status');
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      setError('');
      await api.delete(`/admin/bookings/${bookingId}`);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (err: any) {
      console.error('Delete booking error:', err);
      setError(err.response?.data?.error || 'Failed to delete booking');
    }
  };

  const handleTripDestinationChange = async (tripId: number, destinationId: number) => {
    try {
      setError('');
      const response = await api.patch(`/admin/trips/${tripId}/destination`, { destinationId });
      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === tripId
            ? {
                ...trip,
                destinationId,
                location: destinations.find(d => d.id === destinationId)?.name || trip.location
              }
            : trip
        )
      );
    } catch (err: any) {
      console.error('Update destination error:', err);
      setError(err.response?.data?.error || 'Failed to update destination');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
    const matchesSearch = searchTerm === '' || 
      booking.trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      </Layout>
    );
  }

  return (
    <AdminRoute>
      <Layout>
        <Head>
          <title>Admin Dashboard - Travel Agency</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-12">
            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm relative" role="alert">
                <strong className="font-semibold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-red-800 transition-colors"
                  onClick={() => setError('')}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="fill-current h-5 w-5" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="mb-12">
              <nav className="flex space-x-4 bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/50">
                <Button
                  onClick={() => setActiveTab('trips')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'trips'
                      ? 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white shadow-lg shadow-secondary-500/25 transform hover:-translate-y-0.5'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-secondary-500'
                  }`}
                >
                  Trips
                </Button>
                <Button
                  onClick={() => setActiveTab('destinations')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'destinations'
                      ? 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white shadow-lg shadow-secondary-500/25 transform hover:-translate-y-0.5'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-secondary-500'
                  }`}
                >
                  Destinations
                </Button>
                <Button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'bookings'
                      ? 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white shadow-lg shadow-secondary-500/25 transform hover:-translate-y-0.5'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-secondary-500'
                  }`}
                >
                  Bookings
                </Button>
              </nav>
            </div>

            {activeTab === 'bookings' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-400 bg-clip-text text-transparent">
                    Booking Management
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Manage and review all customer bookings
                  </p>
                </div>

                <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                      </label>
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by trip, location, or email"
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Booking Status
                      </label>
                      <select
                        id="status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as BookingStatus | 'all')}
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Status
                      </label>
                      <select
                        id="payment"
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value as PaymentStatus | 'all')}
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusChange={handleStatusChange}
                      onPaymentStatusChange={handlePaymentStatusChange}
                      onDelete={handleDeleteBooking}
                    />
                  ))}
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                      <p className="text-gray-500">No bookings found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'trips' && (
              <div>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-400 bg-clip-text text-transparent">
                      Trip Management
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Manage and organize your travel packages
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingTrip(true)}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500 shadow-lg shadow-secondary-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Trip
                  </button>
                </div>

                {isAddingTrip && (
                  <div className="mb-8">
                    <TripForm
                      onSubmit={handleAddTrip}
                      onCancel={() => setIsAddingTrip(false)}
                      destinations={destinations}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{trip.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{trip.location}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => handleViewTrip(trip.id)}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-secondary-600 hover:text-white hover:bg-secondary-500 transition-all duration-200"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => setEditingTrip(trip)}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-secondary-600 hover:text-white hover:bg-secondary-500 transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-red-600 hover:text-white hover:bg-red-500 transition-all duration-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500">Price</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            ${trip.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {trip.duration} days
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {trip.location}
                          </p>
                        </div>
                      </div>

                      {editingTrip?.id === trip.id && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                          <TripForm
                            trip={trip}
                            onSubmit={handleUpdateTrip}
                            onCancel={() => setEditingTrip(null)}
                            destinations={destinations}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'destinations' && (
              <div>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-400 bg-clip-text text-transparent">
                      Destination Management
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Manage and organize your travel destinations
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingDestination(true)}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500 shadow-lg shadow-secondary-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Destination
                  </button>
                </div>

                {isAddingDestination && (
                  <div className="mb-8">
                    <DestinationForm
                      onSubmit={handleAddDestination}
                      onCancel={() => setIsAddingDestination(false)}
                    />
                  </div>
                )}

                {editingDestination && (
                  <div className="mb-8">
                    <DestinationForm
                      initialData={editingDestination}
                      onSubmit={handleUpdateDestination}
                      onCancel={() => setEditingDestination(null)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {destinations.map((destination) => (
                    <div key={destination.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{destination.country}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => setEditingDestination(destination)}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-secondary-600 hover:text-white hover:bg-secondary-500 transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteDestination(destination.id)}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-red-600 hover:text-white hover:bg-red-500 transition-all duration-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-gray-600">{destination.description}</p>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Associated Trips</h4>
                        <div className="flex flex-wrap gap-2">
                          {trips
                            .filter((trip) => trip.destinationId === destination.id)
                            .map((trip) => (
                              <span
                                key={trip.id}
                                className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-sm text-gray-700"
                              >
                                {trip.title}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}
