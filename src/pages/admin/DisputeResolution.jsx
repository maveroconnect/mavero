// src/pages/admin/DisputeResolution.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockDisputes = [
  {
    id: 'd1',
    bookingId: 'BK-2026-0452',
    service: 'Pipe Repair',
    amount: 8500,
    client: {
      name: 'Sarah Adebayo',
      email: 'sarah@email.com',
    },
    provider: {
      name: 'John\'s Plumbing',
      email: 'john@plumbing.ng',
    },
    reason: 'Work incomplete',
    description: 'The provider did not complete all the work as agreed. The pipe still leaks in the kitchen.',
    status: 'pending', // pending, in_review, resolved
    initiatedAt: '2026-07-20T14:30:00',
    initiatedBy: 'client',
    messages: [
      {
        id: 'm1',
        sender: 'client',
        senderName: 'Sarah Adebayo',
        message: 'The work is not complete. The pipe still leaks.',
        timestamp: '2026-07-20T14:35:00',
      },
      {
        id: 'm2',
        sender: 'provider',
        senderName: 'John\'s Plumbing',
        message: 'I completed all the work. The leak is from an old pipe that wasn\'t part of the job.',
        timestamp: '2026-07-20T15:00:00',
      },
      {
        id: 'm3',
        sender: 'client',
        senderName: 'Sarah Adebayo',
        message: 'But you said you would fix all leaks in the kitchen.',
        timestamp: '2026-07-20T15:20:00',
      },
    ],
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'd2',
    bookingId: 'BK-2026-0448',
    service: 'Deep Cleaning',
    amount: 12000,
    client: {
      name: 'Michael Okafor',
      email: 'michael@email.com',
    },
    provider: {
      name: 'Clean & Shine',
      email: 'clean@shine.ng',
    },
    reason: 'Poor quality',
    description: 'The cleaning was not thorough. Several areas were missed including the kitchen and bathrooms.',
    status: 'in_review',
    initiatedAt: '2026-07-19T10:15:00',
    initiatedBy: 'client',
    messages: [
      {
        id: 'm4',
        sender: 'client',
        senderName: 'Michael Okafor',
        message: 'The cleaning was very poor. I had to redo it myself.',
        timestamp: '2026-07-19T10:20:00',
      },
      {
        id: 'm5',
        sender: 'provider',
        senderName: 'Clean & Shine',
        message: 'We did a thorough cleaning. Can you specify which areas were missed?',
        timestamp: '2026-07-19T11:00:00',
      },
      {
        id: 'm6',
        sender: 'admin',
        senderName: 'Admin',
        message: 'We are reviewing the case. Please provide photos if available.',
        timestamp: '2026-07-19T14:00:00',
      },
    ],
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'd3',
    bookingId: 'BK-2026-0445',
    service: 'AC Installation',
    amount: 35000,
    client: {
      name: 'Chioma Eze',
      email: 'chioma@email.com',
    },
    provider: {
      name: 'CoolBreeze HVAC',
      email: 'cool@breeze.ng',
    },
    reason: 'Refund requested',
    description: 'The AC unit is not cooling properly. I want a refund or a replacement.',
    status: 'pending',
    initiatedAt: '2026-07-18T16:45:00',
    initiatedBy: 'client',
    messages: [
      {
        id: 'm7',
        sender: 'client',
        senderName: 'Chioma Eze',
        message: 'The AC is not working properly. It\'s not cooling the room.',
        timestamp: '2026-07-18T16:50:00',
      },
      {
        id: 'm8',
        sender: 'provider',
        senderName: 'CoolBreeze HVAC',
        message: 'We can send a technician to check it. There might be a warranty issue.',
        timestamp: '2026-07-18T17:30:00',
      },
    ],
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'd4',
    bookingId: 'BK-2026-0438',
    service: 'Moving Services',
    amount: 30000,
    client: {
      name: 'Tunde Balogun',
      email: 'tunde@email.com',
    },
    provider: {
      name: 'Tunde Moving Logistics',
      email: 'move@logistics.ng',
    },
    reason: 'Damaged items',
    description: 'The movers damaged my furniture during the move. Several items were scratched and broken.',
    status: 'resolved',
    initiatedAt: '2026-07-15T09:00:00',
    initiatedBy: 'client',
    messages: [
      {
        id: 'm9',
        sender: 'client',
        senderName: 'Tunde Balogun',
        message: 'My furniture was damaged during the move.',
        timestamp: '2026-07-15T09:10:00',
      },
      {
        id: 'm10',
        sender: 'provider',
        senderName: 'Tunde Moving Logistics',
        message: 'We have insurance for such cases. We\'ll process a claim.',
        timestamp: '2026-07-15T10:00:00',
      },
      {
        id: 'm11',
        sender: 'admin',
        senderName: 'Admin',
        message: 'We have reviewed the case. The provider\'s insurance will cover the damages.',
        timestamp: '2026-07-16T14:00:00',
      },
    ],
    resolution: 'release_to_provider',
    resolvedAt: '2026-07-16T14:00:00',
    resolvedBy: 'Admin',
  },
  {
    id: 'd5',
    bookingId: 'BK-2026-0432',
    service: 'Electrical Wiring',
    amount: 15000,
    client: {
      name: 'Bola Tinubu',
      email: 'bola@email.com',
    },
    provider: {
      name: 'Spark Electric',
      email: 'spark@electric.ng',
    },
    reason: 'Safety concern',
    description: 'The wiring was done incorrectly. I\'m concerned about fire risk.',
    status: 'pending',
    initiatedAt: '2026-07-17T11:30:00',
    initiatedBy: 'client',
    messages: [
      {
        id: 'm12',
        sender: 'client',
        senderName: 'Bola Tinubu',
        message: 'The wiring looks unsafe. I\'m worried about fire.',
        timestamp: '2026-07-17T11:35:00',
      },
    ],
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
  },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status) => {
  const badges = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: ClockIcon },
    in_review: { color: 'bg-blue-100 text-blue-800', label: 'In Review', icon: EyeIcon },
    resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved', icon: CheckCircleIcon },
  };
  return badges[status] || badges.pending;
};

const getResolutionBadge = (resolution) => {
  const resolutions = {
    release_to_provider: { color: 'bg-blue-100 text-blue-800', label: 'Released to Provider' },
    refund_to_client: { color: 'bg-green-100 text-green-800', label: 'Refunded to Client' },
  };
  return resolutions[resolution] || { color: 'bg-gray-100 text-gray-800', label: 'N/A' };
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const DisputeResolution = () => {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setFilteredDisputes(mockDisputes);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter disputes
  useEffect(() => {
    let filtered = [...disputes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (d) =>
          d.bookingId.toLowerCase().includes(q) ||
          d.service.toLowerCase().includes(q) ||
          d.client.name.toLowerCase().includes(q) ||
          d.provider.name.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    setFilteredDisputes(filtered);
  }, [searchQuery, filterStatus, disputes]);

  // Handle resolve dispute
  const handleResolve = async (disputeId, resolution) => {
    if (!resolutionNote.trim()) {
      toast.error('Please provide a resolution note');
      return;
    }

    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? {
                ...d,
                status: 'resolved',
                resolution: resolution,
                resolvedAt: new Date().toISOString(),
                resolvedBy: 'Admin',
              }
            : d
        )
      );
      toast.success('Dispute resolved successfully!');
      setIsDetailOpen(false);
      setSelectedDispute(null);
      setResolutionNote('');
    } catch (error) {
      toast.error('Failed to resolve dispute. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle dispute click
  const handleDisputeClick = (dispute) => {
    setSelectedDispute(dispute);
    setIsDetailOpen(true);
    setResolutionNote('');
  };

  // Stats
  const total = disputes.length;
  const pending = disputes.filter((d) => d.status === 'pending').length;
  const inReview = disputes.filter((d) => d.status === 'in_review').length;
  const resolved = disputes.filter((d) => d.status === 'resolved').length;

  // ----- Render Detail View -----
  const renderDetail = () => {
    if (!selectedDispute) return null;
    const d = selectedDispute;
    const status = getStatusBadge(d.status);
    const StatusIcon = status.icon;

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
            <h2 className="text-2xl font-bold text-gray-900">Dispute Details</h2>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-semibold text-gray-900">{d.bookingId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>
            </div>

            {/* Dispute Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-800">{d.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800">{formatNaira(d.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium text-gray-800">{d.client.name}</p>
                <p className="text-xs text-gray-400">{d.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium text-gray-800">{d.provider.name}</p>
                <p className="text-xs text-gray-400">{d.provider.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium text-gray-800">{d.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Initiated</p>
                <p className="font-medium text-gray-800">{formatDate(d.initiatedAt)}</p>
                <p className="text-xs text-gray-400">By: {d.initiatedBy}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{d.description}</p>
            </div>

            {/* Messages */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Conversation History</p>
              <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                {d.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-center' : msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.sender === 'admin'
                          ? 'bg-gray-100 text-gray-700'
                          : msg.sender === 'client'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Note */}
            {d.status !== 'resolved' && (
              <div className="border-t border-gray-200 pt-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Explain the resolution decision..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleResolve(d.id, 'release_to_provider')}
                    disabled={actionLoading || !resolutionNote.trim()}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Release to Provider
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleResolve(d.id, 'refund_to_client')}
                    disabled={actionLoading || !resolutionNote.trim()}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CurrencyDollarIcon className="w-5 h-5" />
                        Refund to Client
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Resolution summary if resolved */}
            {d.status === 'resolved' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Resolved</p>
                    <p className="text-sm text-green-700">
                      {d.resolution === 'release_to_provider' ? 'Funds released to provider' : 'Funds refunded to client'}
                      {' • '}Resolved by: {d.resolvedBy}
                      {' • '}{formatDate(d.resolvedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ----- Main Render -----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and resolve customer disputes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total Disputes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{inReview}</div>
          <div className="text-sm text-gray-500">In Review</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{resolved}</div>
          <div className="text-sm text-gray-500">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking ID, service, client, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {filteredDisputes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No disputes found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => {
            const status = getStatusBadge(dispute.status);
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
                onClick={() => handleDisputeClick(dispute)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{dispute.bookingId}</p>
                      <span className="text-sm text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{dispute.service}</p>
                      <span className="text-sm text-gray-400">•</span>
                      <p className="text-sm font-medium text-blue-600">{formatNaira(dispute.amount)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>Client: {dispute.client.name}</span>
                      <span>•</span>
                      <span>Provider: {dispute.provider.name}</span>
                      <span>•</span>
                      <span>Reason: {dispute.reason}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(dispute.initiatedAt)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisputeClick(dispute);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && renderDetail()}
      </AnimatePresence>
    </div>
  );
};

export default DisputeResolution;