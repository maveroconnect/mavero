// src/pages/admin/VettingDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockPendingProviders = [
  {
    id: 'p1',
    firstName: 'Chidi',
    lastName: 'Okafor',
    email: 'chidi@plumbing.ng',
    phone: '+234 803 456 7890',
    businessName: 'Chidi\'s Plumbing Solutions',
    businessDescription: 'Residential and commercial plumbing services. 5 years experience.',
    categories: ['Plumbing', 'HVAC'],
    yearsOfExperience: 5,
    serviceRadius: 25,
    address: {
      street: '15, Ogunlana Drive',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '100001',
    },
    services: [
      { name: 'Pipe Repair', price: 8500, duration: 60 },
      { name: 'Drain Cleaning', price: 12000, duration: 90 },
    ],
    documents: {
      idCard: 'chidi_id.jpg',
      license: 'chidi_license.pdf',
      insurance: 'chidi_insurance.pdf',
      backgroundConsent: 'chidi_consent.pdf',
    },
    submittedAt: '2026-07-18T10:30:00',
    status: 'pending',
    vettingNotes: '',
  },
  {
    id: 'p2',
    firstName: 'Amina',
    lastName: 'Mohammed',
    email: 'amina@clean.ng',
    phone: '+234 812 345 6789',
    businessName: 'Amina\'s Cleaning Services',
    businessDescription: 'Deep cleaning, office cleaning, and post-construction cleaning.',
    categories: ['Cleaning'],
    yearsOfExperience: 3,
    serviceRadius: 15,
    address: {
      street: '22, Ahmadu Bello Way',
      city: 'Abuja',
      state: 'FCT',
      zipCode: '900001',
    },
    services: [
      { name: 'Deep Cleaning', price: 15000, duration: 180 },
      { name: 'Office Cleaning', price: 8000, duration: 120 },
    ],
    documents: {
      idCard: 'amina_id.jpg',
      license: 'amina_license.pdf',
      insurance: 'amina_insurance.pdf',
      backgroundConsent: 'amina_consent.pdf',
    },
    submittedAt: '2026-07-19T14:20:00',
    status: 'pending',
    vettingNotes: '',
  },
  {
    id: 'p3',
    firstName: 'Emeka',
    lastName: 'Nwosu',
    email: 'emeka@electric.ng',
    phone: '+234 805 678 9012',
    businessName: 'Emeka Electrical Services',
    businessDescription: 'Certified electrician with 10 years of experience. Commercial and residential wiring.',
    categories: ['Electrical'],
    yearsOfExperience: 10,
    serviceRadius: 30,
    address: {
      street: '8, Awolowo Road',
      city: 'Ibadan',
      state: 'Oyo',
      zipCode: '200001',
    },
    services: [
      { name: 'Wiring Installation', price: 25000, duration: 180 },
      { name: 'Lighting Repair', price: 7000, duration: 60 },
    ],
    documents: {
      idCard: 'emeka_id.jpg',
      license: 'emeka_license.pdf',
      insurance: 'emeka_insurance.pdf',
      backgroundConsent: 'emeka_consent.pdf',
    },
    submittedAt: '2026-07-20T09:15:00',
    status: 'pending',
    vettingNotes: '',
  },
  {
    id: 'p4',
    firstName: 'Grace',
    lastName: 'Okonkwo',
    email: 'grace@paint.ng',
    phone: '+234 806 789 0123',
    businessName: 'Grace Painting Co.',
    businessDescription: 'Interior and exterior painting, wall finishes, and decorative coatings.',
    categories: ['Painting'],
    yearsOfExperience: 7,
    serviceRadius: 20,
    address: {
      street: '45, Nnamdi Azikiwe Street',
      city: 'Enugu',
      state: 'Enugu',
      zipCode: '400001',
    },
    services: [
      { name: 'Interior Painting', price: 20000, duration: 240 },
      { name: 'Exterior Painting', price: 35000, duration: 360 },
    ],
    documents: {
      idCard: 'grace_id.jpg',
      license: 'grace_license.pdf',
      insurance: 'grace_insurance.pdf',
      backgroundConsent: 'grace_consent.pdf',
    },
    submittedAt: '2026-07-20T16:45:00',
    status: 'pending',
    vettingNotes: '',
  },
  {
    id: 'p5',
    firstName: 'Tunde',
    lastName: 'Balogun',
    email: 'tunde@move.ng',
    phone: '+234 809 012 3456',
    businessName: 'Tunde Moving Logistics',
    businessDescription: 'Local and interstate moving services. Packing, loading, and transportation.',
    categories: ['Moving'],
    yearsOfExperience: 8,
    serviceRadius: 50,
    address: {
      street: '12, Oba Akran Avenue',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '100001',
    },
    services: [
      { name: 'Local Move', price: 30000, duration: 240 },
      { name: 'Interstate Move', price: 80000, duration: 480 },
    ],
    documents: {
      idCard: 'tunde_id.jpg',
      license: 'tunde_license.pdf',
      insurance: 'tunde_insurance.pdf',
      backgroundConsent: 'tunde_consent.pdf',
    },
    submittedAt: '2026-07-21T11:00:00',
    status: 'pending',
    vettingNotes: '',
  },
  {
    id: 'p6',
    firstName: 'Ngozi',
    lastName: 'Eze',
    email: 'ngozi@garden.ng',
    phone: '+234 807 890 1234',
    businessName: 'Ngozi\'s Garden Designs',
    businessDescription: 'Landscaping, garden design, and lawn maintenance services.',
    categories: ['Gardening'],
    yearsOfExperience: 4,
    serviceRadius: 18,
    address: {
      street: '7, University Road',
      city: 'Nsukka',
      state: 'Enugu',
      zipCode: '410001',
    },
    services: [
      { name: 'Garden Design', price: 22000, duration: 300 },
      { name: 'Lawn Mowing', price: 6000, duration: 90 },
    ],
    documents: {
      idCard: 'ngozi_id.jpg',
      license: 'ngozi_license.pdf',
      insurance: 'ngozi_insurance.pdf',
      backgroundConsent: 'ngozi_consent.pdf',
    },
    submittedAt: '2026-07-21T14:30:00',
    status: 'pending',
    vettingNotes: '',
  },
];

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const VettingDashboard = () => {
  const navigate = useNavigate();

  // State
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'week', 'month'
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Load mock data
  useEffect(() => {
    // In real app, fetch from API
    setProviders(mockPendingProviders);
    setFilteredProviders(mockPendingProviders);
    setIsLoading(false);
  }, []);

  // Filter providers
  useEffect(() => {
    let filtered = [...providers];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.businessName.toLowerCase().includes(q) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Date filter
    const now = new Date();
    if (filterDate === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((p) => new Date(p.submittedAt) >= today);
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((p) => new Date(p.submittedAt) >= weekAgo);
    } else if (filterDate === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((p) => new Date(p.submittedAt) >= monthAgo);
    }

    setFilteredProviders(filtered);
  }, [searchQuery, filterDate, providers]);

  // Handle approve/reject
  const handleApprove = async (providerId) => {
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Update local state
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, status: 'approved', vettingNotes: 'Approved by admin' }
            : p
        )
      );
      toast.success('Provider approved successfully!');
      // Close detail if open
      if (selectedProvider?.id === providerId) {
        setIsDetailOpen(false);
        setSelectedProvider(null);
      }
    } catch (error) {
      toast.error('Failed to approve. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (providerId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, status: 'rejected', vettingNotes: rejectReason }
            : p
        )
      );
      toast.success('Provider rejected.');
      setIsDetailOpen(false);
      setSelectedProvider(null);
      setRejectReason('');
    } catch (error) {
      toast.error('Failed to reject. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle provider click to show detail
  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setIsDetailOpen(true);
    setRejectReason(provider.vettingNotes || '');
  };

  // Document icon mapping
  const getDocumentIcon = (docType) => {
    const icons = {
      idCard: <PhotoIcon className="w-5 h-5" />,
      license: <DocumentTextIcon className="w-5 h-5" />,
      insurance: <ShieldCheckIcon className="w-5 h-5" />,
      backgroundConsent: <DocumentCheckIcon className="w-5 h-5" />,
    };
    return icons[docType] || <DocumentTextIcon className="w-5 h-5" />;
  };

  const getDocumentLabel = (docType) => {
    const labels = {
      idCard: 'ID Card',
      license: 'License',
      insurance: 'Insurance',
      backgroundConsent: 'Background Consent',
    };
    return labels[docType] || docType;
  };

  const getStatusBadge = (status) => {
    if (status === 'approved')
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>;
    if (status === 'rejected')
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
  };

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Count statistics
  const total = providers.length;
  const approved = providers.filter((p) => p.status === 'approved').length;
  const rejected = providers.filter((p) => p.status === 'rejected').length;
  const pending = providers.filter((p) => p.status === 'pending').length;

  // ----- Render Detail View (Side Panel or Modal) -----
  const renderDetail = () => {
    if (!selectedProvider) return null;
    const p = selectedProvider;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end"
        onClick={() => setIsDetailOpen(false)}
      >
        <div
          className="bg-white w-full max-w-3xl h-full overflow-y-auto p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircleIcon className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{p.businessName}</h3>
                <p className="text-gray-500">{p.firstName} {p.lastName}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-gray-400">{p.email}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{p.phone}</span>
                </div>
                {getStatusBadge(p.status)}
              </div>
            </div>

            {/* Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-sm text-gray-500">Business Description</p>
                <p className="text-gray-800">{p.businessDescription}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-gray-800">{p.categories.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-gray-800">{p.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Radius</p>
                <p className="text-gray-800">{p.serviceRadius} km</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800">
                  {p.address.street}, {p.address.city}, {p.address.state} {p.address.zipCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="text-gray-800">{formatDate(p.submittedAt)}</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Services Offered</h4>
              <div className="space-y-2">
                {p.services.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{s.duration} min</span>
                    </div>
                    <span className="font-bold text-blue-600">₦{s.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Uploaded Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(p.documents).map(([key, fileName]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => toast.info(`Viewing ${getDocumentLabel(key)}`)}
                  >
                    {getDocumentIcon(key)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{getDocumentLabel(key)}</p>
                      <p className="text-xs text-gray-400 truncate">{fileName}</p>
                    </div>
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Explain why this provider is being rejected..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(p.id)}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(p.id)}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ----- Main Render -----
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Vetting Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Review and approve provider applications</p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterDate('all');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, business, email, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Provider List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading applications...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No applications found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
                onClick={() => handleProviderClick(provider)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{provider.businessName}</h4>
                      <p className="text-sm text-gray-500">
                        {provider.firstName} {provider.lastName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{provider.email}</span>
                        <span>•</span>
                        <span>{provider.phone}</span>
                        <span>•</span>
                        <span className="capitalize">{provider.categories.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {formatDate(provider.submittedAt)}
                    </span>
                    {getStatusBadge(provider.status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProviderClick(provider);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal/Side Panel */}
      <AnimatePresence>
        {isDetailOpen && renderDetail()}
      </AnimatePresence>
    </div>
  );
};

export default VettingDashboard;