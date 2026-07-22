// src/pages/admin/TransactionAudit.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockTransactions = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 50000,
    fee: 0,
    description: 'Wallet top-up - Bank Transfer',
    status: 'completed',
    date: '2026-07-20T14:30:00',
    reference: 'DEP-2026-001',
    user: 'Sarah Adebayo',
    userRole: 'client',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx2',
    type: 'hold',
    amount: -8500,
    fee: 0,
    description: 'Escrow hold - Pipe Repair',
    status: 'pending',
    date: '2026-07-20T10:15:00',
    reference: 'BK-2026-0452',
    user: 'John\'s Plumbing',
    userRole: 'provider',
    paymentMethod: 'Wallet',
    bookingId: 'BK-2026-0452',
  },
  {
    id: 'tx3',
    type: 'withdrawal',
    amount: -25000,
    fee: 150,
    description: 'Bank withdrawal to GTBank',
    status: 'completed',
    date: '2026-07-19T16:45:00',
    reference: 'WD-2026-003',
    user: 'John\'s Plumbing',
    userRole: 'provider',
    paymentMethod: 'GTBank',
  },
  {
    id: 'tx4',
    type: 'release',
    amount: 12000,
    fee: -1800,
    description: 'Escrow release - Drain Cleaning',
    status: 'completed',
    date: '2026-07-19T09:20:00',
    reference: 'BK-2026-0448',
    user: 'Clean & Shine',
    userRole: 'provider',
    paymentMethod: 'Wallet',
    bookingId: 'BK-2026-0448',
  },
  {
    id: 'tx5',
    type: 'deposit',
    amount: 20000,
    fee: 0,
    description: 'Wallet top-up - Card',
    status: 'completed',
    date: '2026-07-18T20:00:00',
    reference: 'DEP-2026-002',
    user: 'Michael Okafor',
    userRole: 'client',
    paymentMethod: 'Card',
  },
  {
    id: 'tx6',
    type: 'commission',
    amount: 1800,
    fee: 0,
    description: 'Platform commission - Drain Cleaning',
    status: 'completed',
    date: '2026-07-19T09:20:00',
    reference: 'COM-2026-001',
    user: 'Platform',
    userRole: 'system',
    paymentMethod: 'Wallet',
    bookingId: 'BK-2026-0448',
  },
  {
    id: 'tx7',
    type: 'refund',
    amount: 30000,
    fee: 0,
    description: 'Refund - Cancelled booking',
    status: 'completed',
    date: '2026-07-16T15:40:00',
    reference: 'REF-2026-002',
    user: 'Tunde Balogun',
    userRole: 'client',
    paymentMethod: 'Wallet',
  },
  {
    id: 'tx8',
    type: 'deposit',
    amount: 15000,
    fee: 0,
    description: 'Wallet top-up - Mobile Money',
    status: 'pending',
    date: '2026-07-15T12:30:00',
    reference: 'DEP-2026-003',
    user: 'Chioma Eze',
    userRole: 'client',
    paymentMethod: 'Mobile Money',
  },
  {
    id: 'tx9',
    type: 'withdrawal',
    amount: -30000,
    fee: 150,
    description: 'Bank withdrawal to Opay',
    status: 'pending',
    date: '2026-07-17T08:10:00',
    reference: 'WD-2026-004',
    user: 'Clean & Shine',
    userRole: 'provider',
    paymentMethod: 'Opay',
  },
  {
    id: 'tx10',
    type: 'release',
    amount: 35000,
    fee: -5250,
    description: 'Escrow release - AC Installation',
    status: 'completed',
    date: '2026-07-21T10:00:00',
    reference: 'BK-2026-0445',
    user: 'CoolBreeze HVAC',
    userRole: 'provider',
    paymentMethod: 'Wallet',
    bookingId: 'BK-2026-0445',
  },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatNaira = (amount) => {
  return '₦' + Math.abs(amount).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getTypeIcon = (type) => {
  const types = {
    deposit: { icon: ArrowDownIcon, color: 'text-green-600', bg: 'bg-green-100' },
    withdrawal: { icon: ArrowUpIcon, color: 'text-red-600', bg: 'bg-red-100' },
    hold: { icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    release: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' },
    refund: { icon: ArrowDownIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    commission: { icon: CurrencyDollarIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
  };
  return types[type] || { icon: CurrencyDollarIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
};

const getStatusBadge = (status) => {
  const badges = {
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
  };
  return badges[status] || badges.pending;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const TransactionAudit = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUserRole, setFilterUserRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          t.user.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    if (filterUserRole !== 'all') {
      filtered = filtered.filter((t) => t.userRole === filterUserRole);
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, filterType, filterStatus, filterUserRole, transactions]);

  // Stats
  const total = transactions.length;
  const completed = transactions.filter((t) => t.status === 'completed').length;
  const pending = transactions.filter((t) => t.status === 'pending').length;
  const totalAmount = transactions
    .filter((t) => t.type !== 'commission' && t.status === 'completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions
    .filter((t) => t.type === 'commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Export CSV (mock)
  const handleExport = () => {
    toast.success('CSV export started. Downloading...');
    // In real app, generate and download CSV
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Audit</h1>
          <p className="text-gray-500 text-sm mt-1">Full transaction history and audit trail</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <button
            onClick={() => toast.info('Print preview')}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total Transactions</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{formatNaira(totalCommission)}</div>
          <div className="text-sm text-gray-500">Total Commission</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, ref, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="hold">Escrow Holds</option>
              <option value="release">Escrow Releases</option>
              <option value="refund">Refunds</option>
              <option value="commission">Commission</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <select
              value={filterUserRole}
              onChange={(e) => setFilterUserRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Users</option>
              <option value="client">Clients</option>
              <option value="provider">Providers</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No transactions found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((t, idx) => {
                  const IconData = getTypeIcon(t.type);
                  const Icon = IconData.icon;
                  const status = getStatusBadge(t.status);
                  const isPositive = t.amount > 0;
                  const isCredit = t.type === 'deposit' || t.type === 'release' || t.type === 'refund' || t.type === 'commission';

                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: idx * 0.02 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className={`p-1.5 rounded-lg w-fit ${IconData.bg}`}>
                          <Icon className={`w-4 h-4 ${IconData.color}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t.description}</p>
                          <p className="text-xs text-gray-400">{t.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-700">{t.user}</p>
                          <p className="text-xs text-gray-400 capitalize">{t.userRole}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{formatNaira(t.amount)}
                        </p>
                        {t.fee !== 0 && (
                          <p className="text-xs text-gray-400">Fee: {formatNaira(t.fee)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{t.reference}</td>
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

export default TransactionAudit;