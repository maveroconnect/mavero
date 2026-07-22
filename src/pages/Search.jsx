// src/pages/Search.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  CheckCircleIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  TruckIcon,
  HomeModernIcon,
  PaintBrushIcon,
  BoltIcon,
  ScissorsIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA (Nigerian Naira)
// ----------------------------

// Service categories with icons
const categories = [
  { id: 'plumbing', name: 'Plumbing', icon: WrenchScrewdriverIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 'cleaning', name: 'Cleaning', icon: SparklesIcon, color: 'bg-green-100 text-green-600' },
  { id: 'electrical', name: 'Electrical', icon: BoltIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'moving', name: 'Moving', icon: TruckIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 'hvac', name: 'HVAC', icon: HomeModernIcon, color: 'bg-red-100 text-red-600' },
  { id: 'painting', name: 'Painting', icon: PaintBrushIcon, color: 'bg-pink-100 text-pink-600' },
  { id: 'gardening', name: 'Gardening', icon: ScissorsIcon, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'general', name: 'General', icon: BuildingOfficeIcon, color: 'bg-gray-100 text-gray-600' },
];

// Mock providers data
const mockProviders = [
  {
    _id: 'p1',
    firstName: 'John',
    lastName: 'Doe',
    profilePhoto: null,
    providerProfile: {
      businessName: 'John\'s Plumbing Services',
      categories: ['Plumbing', 'HVAC'],
      averageRating: 4.8,
      totalReviews: 127,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 8,
      serviceRadius: 20,
      services: [
        { id: 's1', name: 'Pipe Repair', price: 8500, duration: 60 },
        { id: 's2', name: 'Drain Cleaning', price: 12000, duration: 90 },
      ],
    },
    address: {
      city: 'Lagos',
      state: 'Lagos',
    },
    distance: 2.3,
    availability: 'Available Today',
    responseTime: '5 min',
  },
  {
    _id: 'p2',
    firstName: 'Mary',
    lastName: 'Adebayo',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Spark Electric Solutions',
      categories: ['Electrical'],
      averageRating: 4.9,
      totalReviews: 89,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 12,
      serviceRadius: 15,
      services: [
        { id: 's3', name: 'Wiring Installation', price: 15000, duration: 120 },
        { id: 's4', name: 'Fuse Repair', price: 5000, duration: 45 },
      ],
    },
    address: {
      city: 'Abuja',
      state: 'FCT',
    },
    distance: 5.1,
    availability: 'Available Tomorrow',
    responseTime: '2 min',
  },
  {
    _id: 'p3',
    firstName: 'Chidi',
    lastName: 'Okafor',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Clean & Shine Services',
      categories: ['Cleaning'],
      averageRating: 4.7,
      totalReviews: 203,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 5,
      serviceRadius: 25,
      services: [
        { id: 's5', name: 'Deep Cleaning', price: 12000, duration: 180 },
        { id: 's6', name: 'Office Cleaning', price: 8000, duration: 120 },
      ],
    },
    address: {
      city: 'Lagos',
      state: 'Lagos',
    },
    distance: 3.8,
    availability: 'Available Today',
    responseTime: '10 min',
  },
  {
    _id: 'p4',
    firstName: 'Amina',
    lastName: 'Mohammed',
    profilePhoto: null,
    providerProfile: {
      businessName: 'CoolBreeze HVAC',
      categories: ['HVAC'],
      averageRating: 4.6,
      totalReviews: 56,
      vettingStatus: 'pending',
      isVerified: false,
      yearsOfExperience: 3,
      serviceRadius: 10,
      services: [
        { id: 's7', name: 'AC Installation', price: 35000, duration: 180 },
        { id: 's8', name: 'AC Repair', price: 15000, duration: 90 },
      ],
    },
    address: {
      city: 'Port Harcourt',
      state: 'Rivers',
    },
    distance: 8.2,
    availability: 'Available Tomorrow',
    responseTime: '15 min',
  },
  {
    _id: 'p5',
    firstName: 'Emeka',
    lastName: 'Nwosu',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Emeka\'s Moving & Logistics',
      categories: ['Moving'],
      averageRating: 4.5,
      totalReviews: 42,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 10,
      serviceRadius: 30,
      services: [
        { id: 's9', name: 'Local Moving', price: 25000, duration: 240 },
        { id: 's10', name: 'Interstate Moving', price: 80000, duration: 480 },
      ],
    },
    address: {
      city: 'Ibadan',
      state: 'Oyo',
    },
    distance: 12.0,
    availability: 'Available Today',
    responseTime: '8 min',
  },
  {
    _id: 'p6',
    firstName: 'Grace',
    lastName: 'Okonkwo',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Grace\'s Painting Co.',
      categories: ['Painting', 'General'],
      averageRating: 4.8,
      totalReviews: 78,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 7,
      serviceRadius: 18,
      services: [
        { id: 's11', name: 'Interior Painting', price: 18000, duration: 180 },
        { id: 's12', name: 'Exterior Painting', price: 30000, duration: 300 },
      ],
    },
    address: {
      city: 'Lagos',
      state: 'Lagos',
    },
    distance: 4.5,
    availability: 'Available Tomorrow',
    responseTime: '12 min',
  },
  {
    _id: 'p7',
    firstName: 'Tunde',
    lastName: 'Balogun',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Green Thumb Gardening',
      categories: ['Gardening'],
      averageRating: 4.3,
      totalReviews: 34,
      vettingStatus: 'approved',
      isVerified: false,
      yearsOfExperience: 4,
      serviceRadius: 12,
      services: [
        { id: 's13', name: 'Garden Design', price: 20000, duration: 240 },
        { id: 's14', name: 'Lawn Maintenance', price: 8000, duration: 120 },
      ],
    },
    address: {
      city: 'Abeokuta',
      state: 'Ogun',
    },
    distance: 15.3,
    availability: 'Available Today',
    responseTime: '20 min',
  },
  {
    _id: 'p8',
    firstName: 'Ngozi',
    lastName: 'Eze',
    profilePhoto: null,
    providerProfile: {
      businessName: 'Ngozi\'s Electrical Services',
      categories: ['Electrical', 'General'],
      averageRating: 4.9,
      totalReviews: 112,
      vettingStatus: 'approved',
      isVerified: true,
      yearsOfExperience: 15,
      serviceRadius: 22,
      services: [
        { id: 's15', name: 'Full House Wiring', price: 50000, duration: 360 },
        { id: 's16', name: 'Lighting Installation', price: 12000, duration: 90 },
      ],
    },
    address: {
      city: 'Enugu',
      state: 'Enugu',
    },
    distance: 9.7,
    availability: 'Available Tomorrow',
    responseTime: '4 min',
  },
];

// Helper to format Naira
const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Helper to get stars
const getStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));
};

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState('Lagos, Nigeria');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [providers, setProviders] = useState(mockProviders);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'distance' | 'price' | 'relevance'

  // Filters
  const [filters, setFilters] = useState({
    maxDistance: 20,
    minRating: 0,
    maxPrice: 50000,
    availability: 'all', // 'all' | 'today' | 'tomorrow'
    verifiedOnly: false,
  });

  // Pagination
  const [visibleCount, setVisibleCount] = useState(6);
  const [hasMore, setHasMore] = useState(true);

  const resultsRef = useRef(null);

  // Filter providers when search or filters change
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      let filtered = [...providers];

      // Search by business name or description
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.providerProfile.businessName.toLowerCase().includes(query) ||
            p.firstName.toLowerCase().includes(query) ||
            p.lastName.toLowerCase().includes(query) ||
            p.providerProfile.services.some((s) => s.name.toLowerCase().includes(query))
        );
      }

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter((p) =>
          p.providerProfile.categories.some(
            (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
          )
        );
      }

      // Filter by location (simulated)
      if (locationQuery.trim()) {
        // In real app, geocode location and filter by distance
        // For mock, we just show all providers with distance
      }

      // Filter by distance
      filtered = filtered.filter((p) => (p.distance || 0) <= filters.maxDistance);

      // Filter by rating
      filtered = filtered.filter((p) => p.providerProfile.averageRating >= filters.minRating);

      // Filter by price (check if any service is within budget)
      filtered = filtered.filter((p) =>
        p.providerProfile.services.some((s) => s.price <= filters.maxPrice)
      );

      // Filter by availability
      if (filters.availability === 'today') {
        filtered = filtered.filter((p) => p.availability === 'Available Today');
      } else if (filters.availability === 'tomorrow') {
        filtered = filtered.filter((p) => p.availability === 'Available Tomorrow');
      }

      // Filter verified only
      if (filters.verifiedOnly) {
        filtered = filtered.filter((p) => p.providerProfile.isVerified);
      }

      // Sort
      switch (sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.providerProfile.averageRating - a.providerProfile.averageRating);
          break;
        case 'distance':
          filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
          break;
        case 'price':
          filtered.sort((a, b) => {
            const minA = Math.min(...a.providerProfile.services.map((s) => s.price));
            const minB = Math.min(...b.providerProfile.services.map((s) => s.price));
            return minA - minB;
          });
          break;
        case 'relevance':
        default:
          // Keep original order (most relevant)
          break;
      }

      setFilteredProviders(filtered);
      setVisibleCount(6);
      setHasMore(filtered.length > 6);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, locationQuery, filters, sortBy, providers]);

  // Handle loading more results
  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProviders.length));
    if (visibleCount + 6 >= filteredProviders.length) {
      setHasMore(false);
    }
  };

  // Handle provider click
  const handleProviderClick = (providerId) => {
    navigate(`/provider/${providerId}`);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already reactive via useEffect
    toast.success(`Searching for "${searchQuery}"`);
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      maxDistance: 20,
      minRating: 0,
      maxPrice: 50000,
      availability: 'all',
      verifiedOnly: false,
    });
    setSortBy('rating');
    toast.success('Filters reset');
  };

  // Get provider's lowest price
  const getLowestPrice = (provider) => {
    if (!provider.providerProfile.services || provider.providerProfile.services.length === 0) return 0;
    return Math.min(...provider.providerProfile.services.map((s) => s.price));
  };

  // Get provider's service count
  const getServiceCount = (provider) => {
    return provider.providerProfile.services?.length || 0;
  };

  // Get availability color
  const getAvailabilityColor = (availability) => {
    if (availability === 'Available Today') return 'text-green-600 bg-green-100';
    if (availability === 'Available Tomorrow') return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Render provider card
  const renderProviderCard = (provider) => (
    <motion.div
      key={provider._id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      onClick={() => handleProviderClick(provider._id)}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'
      }`}
    >
      <div className={viewMode === 'list' ? 'sm:w-48 flex-shrink-0' : ''}>
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
            {provider.profilePhoto ? (
              <img
                src={provider.profilePhoto}
                alt={provider.providerProfile.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-blue-400 opacity-30">
                {provider.providerProfile.businessName.charAt(0)}
              </span>
            )}
          </div>
          {provider.providerProfile.isVerified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          )}
          {provider.providerProfile.vettingStatus !== 'approved' && (
            <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
              Pending Verification
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 flex-1 flex flex-col ${viewMode === 'list' ? 'sm:p-5' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {provider.providerProfile.businessName}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-0.5">
                {getStars(provider.providerProfile.averageRating)}
                <span className="ml-1 text-sm font-medium text-gray-700">
                  {provider.providerProfile.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-400">({provider.providerProfile.totalReviews})</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 capitalize">
                {provider.providerProfile.categories.slice(0, 2).join(', ')}
                {provider.providerProfile.categories.length > 2 && '...'}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <span className="text-sm font-bold text-blue-600">
              {formatNaira(getLowestPrice(provider))}
            </span>
            <span className="text-xs text-gray-400 block text-right">Starting from</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPinIcon className="w-4 h-4" />
            <span>{provider.address?.city}, {provider.address?.state}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 text-gray-500">
            <ClockIcon className="w-4 h-4" />
            <span>{provider.distance || 'N/A'} km away</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(provider.availability)}`}>
            {provider.availability}
          </span>
          <span className="text-xs text-gray-400">
            {getServiceCount(provider)} services
          </span>
          <span className="text-xs text-gray-400">
            {provider.providerProfile.yearsOfExperience}+ yrs exp.
          </span>
          <span className="text-xs text-gray-400">
            Responds in {provider.responseTime}
          </span>
        </div>

        {/* Quick action button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/booking/${provider._id}`);
          }}
          className="mt-3 self-start px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );

  // Display providers
  const displayedProviders = filteredProviders.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Find Service Providers</h1>
          <p className="text-blue-100 mt-1">Connect with trusted professionals in your area</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 relative">
              <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Your location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 md:gap-3 justify-center whitespace-nowrap"
            >
              <FunnelIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Max Distance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Distance: {filters.maxDistance} km
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={filters.maxDistance}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, maxDistance: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Rating: {filters.minRating} ★
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, minRating: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price: {formatNaira(filters.maxPrice)}
                    </label>
                    <input
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Availability & Verified */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select
                        value={filters.availability}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, availability: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="today">Available Today</option>
                        <option value="tomorrow">Available Tomorrow</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))
                        }
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      Verified Only
                    </label>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Header */}
        <div ref={resultsRef} className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isLoading ? 'Searching...' : `${filteredProviders.length} providers found`}
            </h2>
            {selectedCategory && (
              <p className="text-sm text-gray-500">
                Showing results for: <span className="font-medium capitalize">{selectedCategory}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
              <option value="relevance">Sort by Relevance</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-4 flex gap-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="mt-8 text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No providers found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Try adjusting your search terms, filters, or location to find more results.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`mt-6 gap-4 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }`}
            >
              {displayedProviders.map(renderProviderCard)}
            </div>

            {/* Load More */}
            {hasMore && displayedProviders.length < filteredProviders.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2 mx-auto"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Load More ({filteredProviders.length - displayedProviders.length} remaining)
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="mt-4 text-center text-sm text-gray-400">
              Showing {displayedProviders.length} of {filteredProviders.length} providers
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;