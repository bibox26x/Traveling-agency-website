import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { Booking } from '../types/booking';
import api from '../services/api';
import { Button } from '@heroui/react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    email: '',
    name: '',
    preferences: {
      notifications: false,
      newsletter: false
    }
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProfile(profileRes.data);
        setFormData(profileRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await api.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData(profile);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">My Profile</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-primary-500 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Receive booking notifications
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Subscribe to newsletter
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{profile?.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{profile?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{profile?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1">{profile?.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Notifications:</span>
                  <span className={profile?.preferences.notifications ? 'text-green-600' : 'text-red-600'}>
                    {profile?.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Newsletter:</span>
                  <span className={profile?.preferences.newsletter ? 'text-green-600' : 'text-red-600'}>
                    {profile?.preferences.newsletter ? 'Subscribed' : 'Not subscribed'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setIsEditing(true)}
                  color="primary"
                  variant="solid"
                  size="md"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-md hover:shadow-primary-500/20 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <p className="mb-4">You haven't made any bookings yet.</p>
              <Link
                href="/destinations"
                className="text-secondary-500 hover:text-secondary-600 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{booking.trip.title}</h3>
                    <div className="flex gap-2">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{booking.trip.location}</span>
                    </div>
                    <div>
                      <span className="font-medium">Dates:</span>
                      <div className="text-sm text-gray-600">
                        {new Date(booking.trip.startDate).toLocaleDateString()} - {' '}
                        {new Date(booking.trip.startDate + booking.trip.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Participants:</span>
                      <div className="text-sm text-gray-600">
                        Participants: {booking.guests}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Total Price:</span>
                      <span className="ml-2">${booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.specialRequirements && (
                    <div className="mt-4 text-sm">
                      <span className="font-medium">Special Requirements:</span>
                      <p className="mt-1 text-gray-600">{booking.specialRequirements}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/trips/${booking.trip.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Trip Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 