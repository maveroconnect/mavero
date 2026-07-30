// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/image/logo.jpeg'; // <-- Import your logo

// Icons
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// ---------- Mock Data ----------
const mockWallet = {
  balance: 12500,
  currency: '₦',
  pending: 3200,
  totalDeposited: 45000,
  totalWithdrawn: 32500,
};

const mockTransactions = [
  {
    id: 1,
    type: 'deposit',
    amount: 5000,
    description: 'Wallet funding via card',
    date: '2024-01-15 14:30',
    status: 'completed',
  },
  {
    id: 2,
    type: 'payment',
    amount: -1500,
    description: 'Payment to John\'s Plumbing',
    date: '2024-01-14 09:15',
    status: 'completed',
  },
  {
    id: 3,
    type: 'withdrawal',
    amount: -2000,
    description: 'Withdrawal to bank',
    date: '2024-01-12 11:45',
    status: 'pending',
  },
  {
    id: 4,
    type: 'deposit',
    amount: 3000,
    description: 'Wallet top-up',
    date: '2024-01-10 16:20',
    status: 'completed',
  },
  {
    id: 5,
    type: 'refund',
    amount: 800,
    description: 'Refund from cancelled booking',
    date: '2024-01-08 13:00',
    status: 'completed',
  },
];

// ---------- Fund Wallet Modal ----------
const FundWalletModal = ({ isOpen, onClose, onFund }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleAmountSelect = (value) => {
    setSelectedAmount(value);
    setAmount(value.toString());
    setError('');
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedAmount(null);
    if (value && parseFloat(value) > 0) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numAmount < 100) {
      setError('Minimum top-up is ₦100');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onFund(numAmount);
      onClose();
    } catch (err) {
      setError('Funding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Fund Wallet</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Add funds to your wallet to pay for services securely.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Amount (₦)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountSelect(val)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                      selectedAmount === val
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    ₦{val.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={handleCustomAmount}
                  placeholder="Enter custom amount"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  min="100"
                  step="100"
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                'Fund Wallet'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Secured by Mavero. Your funds are held in escrow.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ---------- Main HomePage Component ----------
const HomePage = () => {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(mockWallet);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  // Handle funding
  const handleFund = (amount) => {
    // Update wallet balance
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      totalDeposited: prev.totalDeposited + amount,
    }));
    // Add transaction
    const newTransaction = {
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      description: 'Wallet funding via card',
      date: new Date().toLocaleString(),
      status: 'completed',
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get transaction icon and color
  const getTransactionInfo = (type) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return { icon: ArrowDownIcon, color: 'text-green-600', bg: 'bg-green-100' };
      case 'payment':
      case 'withdrawal':
        return { icon: ArrowUpIcon, color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { icon: ExclamationCircleIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>;
      case 'pending':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pending</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  // Get user's full name or fallback
  const fullName = user ? `${user.firstName || 'User'} ${user.lastName || ''}`.trim() : 'User';
  const initials = user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') : 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo Image */}
            <img
              src={logo}
              alt="Mavero"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-gray-900">Mavero</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {fullName}!
            </h1>
            <p className="text-gray-600">Manage your wallet and track your activity.</p>
          </div>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Wallet Balance</p>
              <h2 className="text-3xl font-bold mt-1">{formatCurrency(wallet.balance)}</h2>
              <div className="flex gap-4 mt-3 text-sm text-blue-100">
                <span>Pending: {formatCurrency(wallet.pending)}</span>
                <span>•</span>
                <span>Deposited: {formatCurrency(wallet.totalDeposited)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFundModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition backdrop-blur-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Fund Wallet
              </button>
              <Link
                to="/wallet"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition"
              >
                <WalletIcon className="w-4 h-4" />
                Details
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Link
            to="/search"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Find Services</p>
          </Link>
          <Link
            to="/bookings"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition">
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">My Bookings</p>
          </Link>
          <Link
            to="/messages"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Messages</p>
          </Link>
          <Link
            to="/profile"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 transition">
              <UserCircleIcon className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Profile</p>
          </Link>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/wallet" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No transactions yet.</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx) => {
                const { icon: Icon, color, bg } = getTransactionInfo(tx.type);
                const isPositive = tx.type === 'deposit' || tx.type === 'refund';
                return (
                  <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${bg}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDate(tx.date)}</span>
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          &copy; {new Date().getFullYear()} Mavero. All rights reserved.
        </div>
      </main>

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        onFund={handleFund}
      />
    </div>
  );
};

export default HomePage;