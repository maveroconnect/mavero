// src/pages/ProviderProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA (Nigerian Naira)
// ----------------------------

// Mock provider data – personal contact info removed (email, phone)
const mockProvider = {
  _id: 'provider123',
  firstName: 'John',
  lastName: 'Doe',
  // email and phone are removed – not shown
  profilePhoto: null,
  address: {
    street: '42, Awolowo Road',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
  },
  providerProfile: {
    businessName: 'John\'s Plumbing Services',
    businessDescription: 'Reliable and affordable plumbing services for homes and offices. We fix leaks, install pipes, and maintain water systems. Fully insured and licensed.',
    categories: ['Plumbing', 'HVAC', 'General Maintenance'],
    yearsOfExperience: 8,
    serviceRadius: 20, // in km
    averageRating: 4.8,
    totalReviews: 127,
    vettingStatus: 'approved',
    isVerified: true,
    insurance: 'Valid',
    license: 'PL-2023-0452',
    services: [
      { id: 's1', name: 'Pipe Repair', description: 'Fix leaks and broken pipes', price: 8500, duration: 60 },
      { id: 's2', name: 'Drain Cleaning', description: 'Clear clogged drains', price: 12000, duration: 90 },
      { id: 's3', name: 'Water Heater Installation', description: 'Install new water heaters', price: 25000, duration: 120 },
      { id: 's4', name: 'Full Plumbing Installation', description: 'Complete plumbing for new buildings', price: 45000, duration: 180 },
    ],
    workingHours: {
      monday: '8:00 AM – 6:00 PM',
      tuesday: '8:00 AM – 6:00 PM',
      wednesday: '8:00 AM – 6:00 PM',
      thursday: '8:00 AM – 6:00 PM',
      friday: '8:00 AM – 6:00 PM',
      saturday: '9:00 AM – 4:00 PM',
      sunday: 'Closed',
    },
  },
};

// Mock reviews
const mockReviews = [
  {
    id: 'r1',
    clientName: 'Sarah Adebayo',
    rating: 5,
    comment: 'Excellent service! John fixed my pipe quickly and professionally. Highly recommended.',
    date: '2026-06-15',
    avatar: null,
  },
  {
    id: 'r2',
    clientName: 'Michael Okafor',
    rating: 4,
    comment: 'Good work, but arrived a bit late. Still, the quality was top-notch.',
    date: '2026-06-10',
    avatar: null,
  },
  {
    id: 'r3',
    clientName: 'Chioma Eze',
    rating: 5,
    comment: 'Very thorough and affordable. I will definitely use his services again.',
    date: '2026-06-05',
    avatar: null,
  },
  {
    id: 'r4',
    clientName: 'Bola Tinubu',
    rating: 5,
    comment: 'Professional and courteous. Did an amazing job on our office plumbing.',
    date: '2026-05-28',
    avatar: null,
  },
];

// Helper to format Naira
const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Helper to get star rating array
const getStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));
};

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // Simulate loading data from API
  useEffect(() => {
    // In a real app, fetch from API using the id
    // For now, use mock data
    setProvider(mockProvider);
    setReviews(mockReviews);
    setLoading(false);
  }, [id]);

  // Handle booking navigation
  const handleBookNow = () => {
    if (!provider) return;
    navigate(`/booking/${provider._id}`);
  };

  // Handle "Book this service" for a specific service
  const handleBookService = (service) => {
    setSelectedService(service);
    toast.success(`Selected ${service.name} – proceed to booking`);
    navigate(`/booking/${provider._id}?service=${service.id}`);
  };

  // Handle "Message" – navigate to in-app chat
  const handleMessage = () => {
    if (!provider) return;
    toast.success('Opening conversation with provider...');
    navigate(`/messages?provider=${provider._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UserCircleIcon className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Provider not found</h2>
          <Link to="/search" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to search
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${provider.firstName} ${provider.lastName}`;
  const businessName = provider.providerProfile.businessName || fullName;
  const rating = provider.providerProfile.averageRating || 0;
  const reviewCount = provider.providerProfile.totalReviews || 0;
  const categories = provider.providerProfile.categories || [];
  const services = provider.providerProfile.services || [];
  const workingHours = provider.providerProfile.workingHours || {};
  const isVerified = provider.providerProfile.isVerified || false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-md">
                      {provider.profilePhoto ? (
                        <img
                          src={provider.profilePhoto}
                          alt={businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-blue-600">
                          {businessName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{businessName}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {getStars(rating)}
                            <span className="ml-1 font-medium text-gray-700">{rating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{reviewCount} reviews</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm capitalize">{categories.join(', ')}</span>
                        </div>
                      </div>
                      {/* Verification Badge */}
                      {isVerified && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
                          <CheckCircleIcon className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                      {provider.providerProfile.businessDescription || 'No description provided.'}
                    </p>

                    {/* Location only – no email/phone */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon className="w-5 h-5 text-gray-400" />
                        <span>
                          {provider.address?.city || 'Lagos'}, {provider.address?.state || 'Lagos'}
                        </span>
                      </div>
                      {/* Communication note */}
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        In‑app messaging only
                      </span>
                    </div>

                    {/* Credentials */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {provider.providerProfile.license && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          <ShieldCheckIcon className="w-4 h-4" />
                          License: {provider.providerProfile.license}
                        </span>
                      )}
                      {provider.providerProfile.insurance && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          <CheckCircleIcon className="w-4 h-4" />
                          Insured
                        </span>
                      )}
                      {provider.providerProfile.yearsOfExperience && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          <BriefcaseIcon className="w-4 h-4" />
                          {provider.providerProfile.yearsOfExperience}+ years exp.
                        </span>
                      )}
                      {provider.providerProfile.serviceRadius && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          <MapPinIcon className="w-4 h-4" />
                          {provider.providerProfile.serviceRadius} km radius
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services & Pricing</h2>
                {services.length === 0 ? (
                  <p className="text-gray-500 text-sm">No services listed.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-lg font-bold text-blue-600">{formatNaira(service.price)}</span>
                              <span className="text-xs text-gray-400">{service.duration} min</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookService(service)}
                            className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                  <span className="text-sm text-gray-500">{reviewCount} total</span>
                </div>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircleIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{review.clientName}</span>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-1">
                              {getStars(review.rating)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar – Booking CTA & Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Book This Provider</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a service and schedule your appointment.
                </p>
                <button
                  onClick={handleBookNow}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Book Now
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Secure escrow payment – pay only after service is complete.
                </p>
                {/* Message button – in-app chat only */}
                <button
                  onClick={handleMessage}
                  className="w-full mt-3 py-2 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Message Provider
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  All communication is done inside the app.
                </p>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Working Hours</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize text-gray-600">{day}</span>
                      <span className="text-gray-800">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Avg Rating</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{reviewCount}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                    <div className="text-xs text-gray-500">Services</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{isVerified ? '✓' : '—'}</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;