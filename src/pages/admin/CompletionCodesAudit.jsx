// src/pages/admin/CompletionCodesAudit.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockCompletionCodes = [
  {
    id: 'cc1',
    bookingId: 'BK-2026-0452',
    code: '4829',
    provider: 'John\'s Plumbing',
    client: 'Sarah Adebayo',
    generatedAt: '2026-07-20T14:00:00',
    enteredAt: '2026-07-20T14:45:00',
    enteredBy: 'Sarah Adebayo',
    status: 'used',
    ipAddress: '192.168.1.1',
  },
  {
    id: 'cc2',
    bookingId: 'BK-2026-0448',
    code: '7153',
    provider: 'Clean & Shine',
    client: 'Michael Okafor',
    generatedAt: '2026-07-19T10:00:00',
    enteredAt: null,
    enteredBy: null,
    status: 'generated',
    ipAddress: null,
  },
  {
    id: 'cc3',
    bookingId: 'BK-2026-0445',
    code: '2367',
    provider: 'CoolBreeze HVAC',
    client: 'Chioma Eze',
    generatedAt: '2026-07-18T14:00:00',
    enteredAt: '2026-07-18T15:30:00',
    enteredBy: 'Chioma Eze',
    status: 'used',
    ipAddress: '192.168.1.2',
  },
  {
    id: 'cc4',
    bookingId: 'BK-2026-0438',
    code: '9482',
    provider: 'Tunde Moving Logistics',
    client: 'Tunde Balogun',
    generatedAt: '2026-07-15T10:30:00',
    enteredAt: '2026-07-15T15:00:00',
    enteredBy: 'Tunde Balogun',
    status: 'used',
    ipAddress: '192.168.1.3',
  },
  {
    id: 'cc5',
    bookingId: 'BK-2026-0432',
    code: '5618',
    provider: 'Spark Electric',
    client: 'Bola Tinubu',
    generatedAt: '2026-07-17T12:00:00',
    enteredAt: null,
    enteredBy: null,
    status: 'generated',
    ipAddress: null,
  },
  {
    id: 'cc6',
    bookingId: 'BK-2026-0443',
    code: '7394',
    provider: 'Green Thumb',
    client: 'Emeka Nwosu',
    generatedAt: '2026-07-16T09:00:00',
    enteredAt: '2026-07-16T12:30:00',
    enteredBy: 'Emeka Nwosu',
    status: 'used',
    ipAddress: '192.168.1.4',
  },
  {
    id: 'cc7',
    bookingId: 'BK-2026-0441',
    code: '8241',
    provider: 'Spark Electric',
    client: 'Mary Adebayo',
    generatedAt: '2026-07-14T11:00:00',
    enteredAt: null,
    enteredBy: null,
    status: 'expired',
    ipAddress: null,
  },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status) => {
  const badges = {
    used: { color: 'bg-green-100 text-green-800', label: 'Used', icon: CheckCircleIcon },
    generated: { color: 'bg-yellow-100 text-yellow-800', label: 'Generated (Not Used)', icon: ClockIcon },
    expired: { color: 'bg-red-100 text-red-800', label: 'Expired', icon: XCircleIcon },
  };
  return badges[status] || badges.generated;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const CompletionCodesAudit = () => {
  const [codes, setCodes] = useState(mockCompletionCodes);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFilteredCodes(mockCompletionCodes);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...codes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.bookingId.toLowerCase().includes(q) ||
          c.code.includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.client.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setFilteredCodes(filtered);
  }, [searchQuery, filterStatus, codes]);

  // Handle override - mark booking as completed without code
  const handleOverride = async (codeId) => {
    if (!window.confirm('Are you sure you want to mark this booking as completed without the completion code? This will release the escrow funds.')) {
      return;
    }

    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodes((prev) =>
        prev.map((c) =>
          c.id === codeId
            ? { ...c, status: 'used', enteredAt: new Date().toISOString(), enteredBy: 'Admin (Override)' }
            : c
        )
      );
      toast.success('Booking marked as completed. Funds released.');
    } catch (error) {
      toast.error('Failed to override');
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const total = codes.length;
  const used = codes.filter((c) => c.status === 'used').length;
  const generated = codes.filter((c) => c.status === 'generated').length;
  const expired = codes.filter((c) => c.status === 'expired').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading completion codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Completion Codes Audit</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and audit all completion codes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total Codes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{used}</div>
          <div className="text-sm text-gray-500">Used</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{generated}</div>
          <div className="text-sm text-gray-500">Generated (Pending)</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{expired}</div>
          <div className="text-sm text-gray-500">Expired</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking ID, code, provider, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="used">Used</option>
              <option value="generated">Generated (Not Used)</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Codes Table */}
      {filteredCodes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <KeyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No completion codes found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCodes.map((code) => {
                  const status = getStatusBadge(code.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={code.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{code.bookingId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-bold text-lg text-blue-600">
                          {code.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{code.provider}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{code.client}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(code.generatedAt)}</td>
                      <td className="px-6 py-4">
                        {code.status !== 'used' && (
                          <button
                            onClick={() => handleOverride(code.id)}
                            disabled={actionLoading}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Override
                          </button>
                        )}
                        {code.status === 'used' && (
                          <span className="text-sm text-green-600">✓ Completed</span>
                        )}
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

export default CompletionCodesAudit;