// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { addDays, startOfDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  WalletIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// ----------------------------
// MOCK DATA (NIGERIAN NAIRA)
// ----------------------------

// Mock provider data with ₦ prices
const mockProvider = {
  _id: 'mock123',
  firstName: 'John',
  lastName: 'Doe',
  profilePhoto: null,
  providerProfile: {
    businessName: 'John\'s Plumbing Services',
    averageRating: 4.8,
    totalReviews: 127,
    vettingStatus: 'approved',
    categories: ['Plumbing', 'HVAC'],
    services: [
      { id: 's1', name: 'Pipe Repair', description: 'Fix leaks and broken pipes', price: 8500, duration: 60 },
      { id: 's2', name: 'Drain Cleaning', description: 'Clear clogged drains', price: 12000, duration: 90 },
      { id: 's3', name: 'Water Heater Installation', description: 'Install new water heaters', price: 25000, duration: 120 },
    ],
  },
};

// Mock wallet balance in Naira
const mockWalletBalance = 15000; // ₦15,000 available

// Helper: generate time slots (unchanged)
const generateTimeSlots = (startHour = 8, endHour = 20, interval = 30) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hour = h.toString().padStart(2, '0');
      const min = m.toString().padStart(2, '0');
      slots.push(`${hour}:${min}`);
    }
  }
  return slots;
};

// Helper: format Naira
const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const BookingPage = () => {
  const { id: providerId } = useParams();
  const navigate = useNavigate();

  // State
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(mockWalletBalance);
  const [provider] = useState(mockProvider);

  // Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bookingDate: new Date(),
      startTime: '',
      address: '',
      additionalNotes: '',
    },
  });

  const selectedDate = watch('bookingDate');

  // Set default service
  useEffect(() => {
    if (provider?.providerProfile?.services?.length) {
      setSelectedService(provider.providerProfile.services[0]);
    }
  }, [provider]);

  // Generate time slots on date change
  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(generateTimeSlots(8, 20, 30));
    }
  }, [selectedDate]);

  // Handle form submission (mock)
  const onSubmit = (formData) => {
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (!formData.startTime) {
      toast.error('Please select a time');
      return;
    }
    if (!formData.address) {
      toast.error('Please enter your address');
      return;
    }

    const totalCost = selectedService.price + selectedService.price * 0.15;
    if (walletBalance < totalCost) {
      toast.error('Insufficient balance. Please top up your wallet.');
      setIsTopUpModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Booking confirmed! Funds held in escrow (mock).');
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  // Handle top-up (mock)
  const handleTopUp = () => {
    if (topUpAmount && topUpAmount > 0) {
      setWalletBalance((prev) => prev + topUpAmount);
      toast.success(`Wallet topped up by ${formatNaira(topUpAmount)} (mock)`);
      setIsTopUpModalOpen(false);
      setTopUpAmount(null);
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  // Calculations
  const subtotal = selectedService?.price || 0;
  const platformFee = subtotal * 0.15;
  const total = subtotal + platformFee;
  const hasSufficientBalance = walletBalance >= total;

  // Provider info
  const providerName = provider.providerProfile.businessName || `${provider.firstName} ${provider.lastName}`;
  const rating = provider.providerProfile.averageRating || 0;
  const reviewCount = provider.providerProfile.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <Link
          to={`/provider/${providerId || 'mock'}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header with provider info */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                      {provider.profilePhoto ? (
                        <img
                          src={provider.profilePhoto}
                          alt={providerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {providerName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{providerName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{reviewCount} reviews</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">
                        {provider.providerProfile.categories?.join(', ') || 'General'}
                      </span>
                    </div>
                  </div>
                  {provider.providerProfile.vettingStatus === 'approved' && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <CheckCircleIcon className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Service Selection */}
                {provider.providerProfile.services && provider.providerProfile.services.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Service
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {provider.providerProfile.services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className={`p-4 border rounded-xl text-left transition-all ${
                            selectedService?.id === service.id
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-blue-600">{formatNaira(service.price)}</span>
                            <span className="text-xs text-gray-400">{service.duration} min</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.serviceId && (
                      <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
                    )}
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <Controller
                      name="bookingDate"
                      control={control}
                      rules={{ required: 'Please select a date' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          minDate={startOfDay(addDays(new Date(), 1))}
                          maxDate={addDays(new Date(), 30)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Select date"
                        />
                      )}
                    />
                    {errors.bookingDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.bookingDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{ required: 'Please select a time' }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                          <option value="">Select time</option>
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    Service Address
                  </label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Please enter your address' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter your full address"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Controller
                    name="additionalNotes"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Any special instructions or details for the provider"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      />
                    )}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary / Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>

              {/* Service details */}
              {selectedService ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{selectedService.name}</div>
                      <div className="text-sm text-gray-500">{selectedService.duration} minutes</div>
                    </div>
                    <div className="font-medium text-gray-900">{formatNaira(selectedService.price)}</div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Platform fee (15%)</span>
                      <span>{formatNaira(platformFee)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">{formatNaira(total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Please select a service to see pricing
                </div>
              )}

              {/* Wallet Balance */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Wallet Balance</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatNaira(walletBalance)}</span>
                </div>
                {total > 0 && (
                  <div className={`text-sm ${hasSufficientBalance ? 'text-green-600' : 'text-red-600'}`}>
                    {hasSufficientBalance ? (
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        Sufficient balance
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Insufficient balance
                      </span>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsTopUpModalOpen(true)}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <CreditCardIcon className="w-4 h-4" />
                  Top up wallet
                </button>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !selectedService || !hasSufficientBalance}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
              <p className="text-xs text-gray-500 text-center">
                By confirming, funds will be held in escrow and released after service completion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsTopUpModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Top Up Wallet</h3>
                <button
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Add funds to your wallet. Current balance:{' '}
                <span className="font-semibold">{formatNaira(walletBalance)}</span>
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[5000, 10000, 20000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`p-3 border rounded-xl text-center transition ${
                        topUpAmount === amount
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold">{formatNaira(amount)}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom amount
                  </label>
                  <input
                    type="number"
                    value={topUpAmount || ''}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    placeholder="Enter amount in Naira"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    min={100}
                    step={100}
                  />
                </div>
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || topUpAmount <= 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Add Funds
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;