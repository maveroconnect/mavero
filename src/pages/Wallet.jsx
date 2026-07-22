// src/pages/Wallet.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QrCodeIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA (Nigerian Naira)
// ----------------------------

// Mock wallet data
const mockWallet = {
  balance: 24750,
  pendingBalance: 8500,
  totalDeposited: 120000,
  totalWithdrawn: 95750,
  totalEarned: 420000,
  availableBalance: 24750,
  currency: 'NGN',
};

// Mock transaction history
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
    paymentMethod: 'Wallet',
    bookingId: 'bk1',
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
    paymentMethod: 'Wallet',
    bookingId: 'bk2',
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
    paymentMethod: 'Card',
  },
  {
    id: 'tx6',
    type: 'hold',
    amount: -45000,
    fee: 0,
    description: 'Escrow hold - Full Plumbing Installation',
    status: 'completed',
    date: '2026-07-18T14:30:00',
    reference: 'BK-2026-0445',
    paymentMethod: 'Wallet',
    bookingId: 'bk3',
  },
  {
    id: 'tx7',
    type: 'release',
    amount: 45000,
    fee: -6750,
    description: 'Escrow release - Full Plumbing Installation',
    status: 'completed',
    date: '2026-07-17T11:00:00',
    reference: 'BK-2026-0445',
    paymentMethod: 'Wallet',
    bookingId: 'bk3',
  },
  {
    id: 'tx8',
    type: 'withdrawal',
    amount: -30000,
    fee: 150,
    description: 'Bank withdrawal to Opay',
    status: 'pending',
    date: '2026-07-17T08:10:00',
    reference: 'WD-2026-004',
    paymentMethod: 'Opay',
  },
  {
    id: 'tx9',
    type: 'refund',
    amount: 8500,
    fee: 0,
    description: 'Refund - Cancelled booking',
    status: 'completed',
    date: '2026-07-16T15:40:00',
    reference: 'REF-2026-002',
    paymentMethod: 'Wallet',
  },
  {
    id: 'tx10',
    type: 'deposit',
    amount: 15000,
    fee: 0,
    description: 'Wallet top-up - Mobile Money',
    status: 'completed',
    date: '2026-07-15T12:30:00',
    reference: 'DEP-2026-003',
    paymentMethod: 'Mobile Money',
  },
];

// Mock pending withdrawals
const mockPendingWithdrawals = [
  {
    id: 'wd1',
    amount: 30000,
    fee: 150,
    bankName: 'Opay',
    accountNumber: '****1234',
    accountName: 'John Doe',
    status: 'pending',
    date: '2026-07-17T08:10:00',
    reference: 'WD-2026-004',
  },
];

// Helper to format Naira
const formatNaira = (amount) => {
  return '₦' + Math.abs(amount).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// Helper to get transaction icon
const getTransactionIcon = (type, amount) => {
  const isPositive = amount > 0;
  const iconMap = {
    deposit: { icon: ArrowDownIcon, color: 'text-green-600', bg: 'bg-green-100' },
    withdrawal: { icon: ArrowUpIcon, color: 'text-red-600', bg: 'bg-red-100' },
    hold: { icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    release: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' },
    refund: { icon: ArrowDownIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
  };
  const defaultIcon = { icon: CreditCardIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
  return iconMap[type] || defaultIcon;
};

// Helper to get status badge
const getStatusBadge = (status) => {
  const badges = {
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Completed' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Failed' },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, label: 'Cancelled' },
  };
  return badges[status] || { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: status };
};

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(mockWallet);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(mockPendingWithdrawals);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(null);
  const [depositMethod, setDepositMethod] = useState('card');
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Filter by status
    if (activeTab === 'pending') {
      filtered = filtered.filter(tx => tx.status === 'pending');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(tx => tx.status === 'completed');
    } else if (activeTab === 'failed') {
      filtered = filtered.filter(tx => tx.status === 'failed');
    }

    // Date range filter (simplified)
    if (dateRange.start) {
      const start = new Date(dateRange.start);
      filtered = filtered.filter(tx => new Date(tx.date) >= start);
    }
    if (dateRange.end) {
      const end = new Date(dateRange.end);
      filtered = filtered.filter(tx => new Date(tx.date) <= end);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate summary stats
  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalFees = transactions
    .filter(tx => tx.fee && tx.status === 'completed')
    .reduce((sum, tx) => sum + Math.abs(tx.fee), 0);

  const totalEarnings = transactions
    .filter(tx => tx.type === 'release' && tx.status === 'completed')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Handle deposit
  const handleDeposit = () => {
    if (!depositAmount || depositAmount < 100) {
      toast.error('Please enter a valid amount (minimum ₦100)');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newBalance = wallet.balance + depositAmount;
      setWallet(prev => ({ ...prev, balance: newBalance, totalDeposited: prev.totalDeposited + depositAmount }));
      const newTx = {
        id: `tx${Date.now()}`,
        type: 'deposit',
        amount: depositAmount,
        fee: 0,
        description: `Wallet top-up - ${depositMethod.charAt(0).toUpperCase() + depositMethod.slice(1)}`,
        status: 'completed',
        date: new Date().toISOString(),
        reference: `DEP-${Date.now()}`,
        paymentMethod: depositMethod.charAt(0).toUpperCase() + depositMethod.slice(1),
      };
      setTransactions(prev => [newTx, ...prev]);
      toast.success(`Successfully deposited ${formatNaira(depositAmount)}`);
      setShowDepositModal(false);
      setDepositAmount(null);
      setIsSubmitting(false);
    }, 1500);
  };

  // Handle withdrawal
  const handleWithdraw = () => {
    if (!withdrawAmount || withdrawAmount < 100) {
      toast.error('Please enter a valid amount (minimum ₦100)');
      return;
    }
    if (withdrawAmount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }
    if (!withdrawBank || !withdrawAccount || !withdrawAccountName) {
      toast.error('Please fill in all bank details');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newBalance = wallet.balance - withdrawAmount;
      setWallet(prev => ({ ...prev, balance: newBalance, totalWithdrawn: prev.totalWithdrawn + withdrawAmount }));
      const newTx = {
        id: `tx${Date.now()}`,
        type: 'withdrawal',
        amount: -withdrawAmount,
        fee: 150,
        description: `Bank withdrawal to ${withdrawBank}`,
        status: 'pending',
        date: new Date().toISOString(),
        reference: `WD-${Date.now()}`,
        paymentMethod: withdrawBank,
      };
      setTransactions(prev => [newTx, ...prev]);
      // Add to pending withdrawals
      setPendingWithdrawals(prev => [...prev, {
        id: `wd${Date.now()}`,
        amount: withdrawAmount,
        fee: 150,
        bankName: withdrawBank,
        accountNumber: `****${withdrawAccount.slice(-4)}`,
        accountName: withdrawAccountName,
        status: 'pending',
        date: new Date().toISOString(),
        reference: `WD-${Date.now()}`,
      }]);
      toast.success(`Withdrawal request submitted for ${formatNaira(withdrawAmount)}`);
      setShowWithdrawModal(false);
      setWithdrawAmount(null);
      setWithdrawBank('');
      setWithdrawAccount('');
      setWithdrawAccountName('');
      setIsSubmitting(false);
    }, 1500);
  };

  // Quick deposit presets
  const depositPresets = [5000, 10000, 20000, 50000];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Wallet</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your funds and transactions</p>
          </div>
          <Link
            to="/dashboard"
            className="mt-3 sm:mt-0 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Main Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Available Balance</p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {showBalance ? formatNaira(wallet.balance) : '••••••'}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-blue-200 hover:text-white transition"
                  >
                    {showBalance ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-blue-200 text-sm mt-1">
                  {user?.role === 'provider' ? 'Available for withdrawal' : 'Ready to spend'}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 px-4 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowDownIcon className="w-4 h-4" />
                Deposit
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 px-4 py-2.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2"
              >
                <ArrowUpIcon className="w-4 h-4" />
                Withdraw
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <BanknotesIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Deposited</p>
                <p className="text-lg font-bold text-gray-900">{formatNaira(totalDeposits)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <ArrowUpIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Withdrawn</p>
                <p className="text-lg font-bold text-gray-900">{formatNaira(totalWithdrawals)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second Row - Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Pending Balance</p>
            <p className="text-lg font-bold text-yellow-600">{formatNaira(wallet.pendingBalance)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Total Fees</p>
            <p className="text-lg font-bold text-red-600">{formatNaira(totalFees)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Total Earnings</p>
            <p className="text-lg font-bold text-green-600">{formatNaira(totalEarnings)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Currency</p>
            <p className="text-lg font-bold text-gray-900">₦ NGN</p>
          </div>
        </div>

        {/* Pending Withdrawals Notice */}
        {pendingWithdrawals.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Withdrawals</p>
              <p className="text-sm text-yellow-700">
                You have {pendingWithdrawals.length} pending withdrawal request(s) totaling {formatNaira(pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0))}
              </p>
            </div>
          </div>
        )}

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                <p className="text-sm text-gray-500">All your financial activities in one place</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1">
                  <PrinterIcon className="w-4 h-4" />
                  Print
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1">
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'completed', 'failed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none px-3 py-1.5 pr-8 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="hold">Escrow Holds</option>
                <option value="release">Escrow Releases</option>
                <option value="refund">Refunds</option>
              </select>
              <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-2 top-2 pointer-events-none" />
            </div>

            {/* Date Range - Simplified */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="text-xs text-gray-500 hover:text-gray-700 transition px-2 py-1 bg-gray-100 rounded-lg">Today</button>
              <button className="text-xs text-gray-500 hover:text-gray-700 transition px-2 py-1 bg-gray-100 rounded-lg">This Week</button>
              <button className="text-xs text-gray-500 hover:text-gray-700 transition px-2 py-1 bg-gray-100 rounded-lg">This Month</button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BanknotesIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No transactions found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredTransactions.map((tx, index) => {
                const isPositive = tx.amount > 0;
                const IconData = getTransactionIcon(tx.type, tx.amount);
                const StatusData = getStatusBadge(tx.status);
                const Icon = IconData.icon;
                const StatusIcon = StatusData.icon;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="px-6 py-4 hover:bg-gray-50 transition group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl ${IconData.bg}`}>
                        <Icon className={`w-5 h-5 ${IconData.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${StatusData.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {StatusData.label}
                          </span>
                          {tx.bookingId && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              Booking #{tx.bookingId}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>{new Date(tx.date).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{tx.reference}</span>
                          {tx.paymentMethod && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{tx.paymentMethod}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{formatNaira(tx.amount)}
                        </p>
                        {tx.fee !== 0 && (
                          <p className="text-xs text-gray-400">
                            Fee: {formatNaira(Math.abs(tx.fee))}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* DEPOSIT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDepositModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Deposit Funds</h3>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Add funds to your wallet. All deposits are secure and processed instantly.
              </p>

              {/* Amount Presets */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {depositPresets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount)}
                    className={`p-2 border rounded-lg text-center transition ${
                      depositAmount === amount
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm">{formatNaira(amount)}</div>
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Custom amount"
                value={depositAmount || ''}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4"
                min={100}
                step={100}
              />

              {/* Payment Method */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {['card', 'bank', 'mobile'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setDepositMethod(method)}
                    className={`p-3 border rounded-xl text-center transition capitalize ${
                      depositMethod === method
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {method === 'card' && <CreditCardIcon className="w-5 h-5 mx-auto mb-1" />}
                    {method === 'bank' && <BuildingOfficeIcon className="w-5 h-5 mx-auto mb-1" />}
                    {method === 'mobile' && <QrCodeIcon className="w-5 h-5 mx-auto mb-1" />}
                    <span className="text-xs">{method}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleDeposit}
                disabled={isSubmitting || !depositAmount || depositAmount < 100}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Deposit {depositAmount ? formatNaira(depositAmount) : ''}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Deposits are instant and no fees are charged.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WITHDRAWAL MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Withdraw Funds</h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                Available balance: <span className="font-bold">{formatNaira(wallet.balance)}</span>
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Withdrawal fee: ₦150. Processing time: 1-3 business days.
              </p>

              {/* Amount */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                placeholder="Enter amount to withdraw"
                value={withdrawAmount || ''}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4"
                min={100}
                max={wallet.balance}
                step={100}
              />

              {/* Bank Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <select
                    value={withdrawBank}
                    onChange={(e) => setWithdrawBank(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select a bank</option>
                    <option value="GTBank">GTBank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="First Bank">First Bank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Opay">Opay</option>
                    <option value="PalmPay">PalmPay</option>
                    <option value="Kuda Bank">Kuda Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    value={withdrawAccountName}
                    onChange={(e) => setWithdrawAccountName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Summary */}
              {withdrawAmount > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Withdrawal Amount</span>
                    <span className="font-medium">{formatNaira(withdrawAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">{formatNaira(150)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                    <span>Total Deducted</span>
                    <span className="text-red-600">{formatNaira(withdrawAmount + 150)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdraw}
                disabled={isSubmitting || !withdrawAmount || withdrawAmount < 100 || withdrawAmount > wallet.balance || !withdrawBank || !withdrawAccount || !withdrawAccountName}
                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Request Withdrawal'
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Withdrawals are processed within 1-3 business days.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;