// src/pages/admin/EscrowManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockEscrowEntries = [
  {
    id: 'e1',
    bookingId: 'BK-2026-0452',
    service: 'Pipe Repair',
    amount: 8500,
    client: 'Sarah Adebayo',
    provider: 'John\'s Plumbing',
    status: 'held',
    createdAt: '2026-07-20T10:30:00',
    releasedAt: null,
    expiryDate: '2026-08-19T10:30:00',
  },
  {
    id: 'e2',
    bookingId: 'BK-2026-0448',
    service: 'Deep Cleaning',
    amount: 12000,
    client: 'Michael Okafor',
    provider: 'Clean & Shine',
    status: 'held',
    createdAt: '2026-07-19T09:15:00',
    releasedAt: null,
    expiryDate: '2026-08-18T09:15:00',
  },
  {
    id: 'e3',
    bookingId: 'BK-2026-0445',
    service: 'AC Installation',
    amount: 35000,
    client: 'Chioma Eze',
    provider: 'CoolBreeze HVAC',
    status: 'released',
    createdAt: '2026-07-18T14:20:00',
    releasedAt: '2026-07-21T10:00:00',
    expiryDate: '2026-08-17T14:20:00',
  },
  {
    id: 'e4',
    bookingId: 'BK-2026-0438',
    service: 'Moving Services',
    amount: 30000,
    client: 'Tunde Balogun',
    provider: 'Tunde Moving Logistics',
    status: 'refunded',
    createdAt: '2026-07-15T09:00:00',
    releasedAt: '2026-07-18T14:00:00',
    expiryDate: '2026-08-14T09:00:00',
  },
  {
    id: 'e5',
    bookingId: 'BK-2026-0432',
    service: 'Electrical Wiring',
    amount: 15000,
    client: 'Bola Tinubu',
    provider: 'Spark Electric',
    status: 'held',
    createdAt: '2026-07-17T11:30:00',
    releasedAt: null,
    expiryDate: '2026-08-16T11:30:00',
  },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status) => {
  const badges = {
    held: { color: 'bg-yellow-100 text-yellow-800', label: 'Held in Escrow', icon: LockClosedIcon },
    released: { color: 'bg-green-100 text-green-800', label: 'Released', icon: LockOpenIcon },
    refunded: { color: 'bg-red-100 text-red-800', label: 'Refunded', icon: CurrencyDollarIcon },
    pending: { color: 'bg-blue-100 text-blue-800', label: 'Pending', icon: ClockIcon },
  };
  return badges[status] || badges.pending;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const EscrowManagement = () => {
  const [escrowEntries, setEscrowEntries] = useState(mockEscrowEntries);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFilteredEntries(mockEscrowEntries);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter entries
  useEffect(() => {
    let filtered = [...escrowEntries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.bookingId.toLowerCase().includes(q) ||
          e.service.toLowerCase().includes(q) ||
          e.client.toLowerCase().includes(q) ||
          e.provider.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredEntries(filtered);
  }, [searchQuery, filterStatus, escrowEntries]);

  // Handle manual release (admin override)
  const handleManualRelease = async (entryId) => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEscrowEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? { ...e, status: 'released', releasedAt: new Date().toISOString() }
            : e
        )
      );
      toast.success('Funds released from escrow successfully');
    } catch (error) {
      toast.error('Failed to release funds');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle refund
  const handleRefund = async (entryId) => {
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEscrowEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? { ...e, status: 'refunded', releasedAt: new Date().toISOString() }
            : e
        )
      );
      toast.success('Funds refunded to client');
    } catch (error) {
      toast.error('Failed to refund funds');
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const total = escrowEntries.length;
  const held = escrowEntries.filter((e) => e.status === 'held').length;
  const released = escrowEntries.filter((e) => e.status === 'released').length;
  const refunded = escrowEntries.filter((e) => e.status === 'refunded').length;
  const totalHeld = escrowEntries
    .filter((e) => e.status === 'held')
    .reduce((sum, e) => sum + e.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading escrow data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escrow Management</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage all escrow holdings</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            Total Held: {formatNaira(totalHeld)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total Entries</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{held}</div>
          <div className="text-sm text-gray-500">Held in Escrow</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{released}</div>
          <div className="text-sm text-gray-500">Released</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{refunded}</div>
          <div className="text-sm text-gray-500">Refunded</div>
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
              <option value="held">Held in Escrow</option>
              <option value="released">Released</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Escrow List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No escrow entries found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.map((entry) => {
                  const status = getStatusBadge(entry.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{entry.bookingId}</p>
                          <p className="text-xs text-gray-400">{entry.client} → {entry.provider}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.service}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(entry.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(entry.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {entry.status === 'held' && (
                            <>
                              <button
                                onClick={() => handleManualRelease(entry.id)}
                                disabled={actionLoading}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                              >
                                Release
                              </button>
                              <button
                                onClick={() => handleRefund(entry.id)}
                                disabled={actionLoading}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                              >
                                Refund
                              </button>
                            </>
                          )}
                          {entry.status === 'released' && (
                            <span className="text-sm text-green-600">✓ Released</span>
                          )}
                          {entry.status === 'refunded' && (
                            <span className="text-sm text-red-600">↻ Refunded</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowManagement;