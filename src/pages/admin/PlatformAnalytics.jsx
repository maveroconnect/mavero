// src/pages/admin/PlatformAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BriefcaseIcon,
  WalletIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,  // ✅ Added for export button
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockAnalytics = {
  overview: {
    totalUsers: 15473,
    totalProviders: 2108,
    totalClients: 13365,
    totalBookings: 10428,
    totalRevenue: 17060000, // ₦17.06M
    totalEscrowBalance: 284500000,
    activeUsers: 8234,
    newUsersThisMonth: 1245,
    growth: 12.8,
  },
  bookings: {
    today: 142,
    week: 847,
    month: 3256,
    previousMonth: 2950,
    growth: 10.4,
    categories: [
      { name: 'Plumbing', count: 2845, revenue: 24182500 },
      { name: 'Cleaning', count: 2156, revenue: 17248000 },
      { name: 'Electrical', count: 1874, revenue: 28110000 },
      { name: 'Moving', count: 1256, revenue: 37680000 },
      { name: 'HVAC', count: 987, revenue: 34545000 },
      { name: 'Painting', count: 765, revenue: 19125000 },
      { name: 'Gardening', count: 545, revenue: 10900000 },
    ],
  },
  revenue: {
    commission: 12560000,
    interest: 4500000,
    total: 17060000,
    monthlyTrend: [
      { month: 'Jan', amount: 980000 },
      { month: 'Feb', amount: 1120000 },
      { month: 'Mar', amount: 1350000 },
      { month: 'Apr', amount: 1480000 },
      { month: 'May', amount: 1620000 },
      { month: 'Jun', amount: 1850000 },
    ],
  },
  userActivity: {
    dailyActive: 8234,
    weeklyActive: 12450,
    monthlyActive: 15473,
    signupsThisMonth: 1245,
    churnRate: 4.2,
    retentionRate: 87.5,
  },
};

// ----------------------------
// HELPERS
// ----------------------------

const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatNumber = (num) => {
  return num.toLocaleString('en-NG');
};

const formatShortNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getGrowthColor = (growth) => {
  return growth >= 0 ? 'text-green-600' : 'text-red-600';
};

// ✅ Fixed: Use ArrowTrendingUpIcon and ArrowTrendingDownIcon directly
const getGrowthIcon = (growth) => {
  return growth >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, bookings, revenue, userActivity } = analytics;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Comprehensive platform insights and metrics</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => toast.success('Exporting report...')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />  {/* ✅ Fixed */}
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatShortNumber(overview.totalUsers)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-xl">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
            {overview.growth}% this month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{formatShortNumber(overview.totalBookings)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-xl">
              <BriefcaseIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
            +{bookings.growth}% this month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatShortNumber(overview.totalRevenue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-xl">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
            +8.3% this month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Escrow Balance</p>
              <p className="text-2xl font-bold text-blue-600">{formatShortNumber(overview.totalEscrowBalance)}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-xl">
              <WalletIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <ClockIcon className="w-3 h-3" />
            Held in escrow
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend (mock chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
            <span className="text-xs text-gray-500">Monthly</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 pt-4">
            {revenue.monthlyTrend.map((data, i) => {
              const max = Math.max(...revenue.monthlyTrend.map(d => d.amount));
              const height = (data.amount / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-sm transition-all hover:from-blue-600 hover:to-blue-700"
                    style={{ height: height + 'px' }}
                  />
                  <span className="text-[10px] text-gray-400">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Min: {formatNaira(Math.min(...revenue.monthlyTrend.map(d => d.amount)))}</span>
            <span>Max: {formatNaira(Math.max(...revenue.monthlyTrend.map(d => d.amount)))}</span>
          </div>
        </div>

        {/* Booking Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bookings by Category</h3>
          <div className="space-y-3">
            {bookings.categories.slice(0, 6).map((cat) => {
              const percentage = (cat.count / bookings.month) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-500">{formatNaira(cat.revenue)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: percentage + '%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Commission Revenue</p>
          <p className="text-2xl font-bold text-blue-600">{formatNaira(revenue.commission)}</p>
          <p className="text-xs text-gray-400 mt-1">15% platform fee</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Interest Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatNaira(revenue.interest)}</p>
          <p className="text-xs text-gray-400 mt-1">4% APY on idle balances</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">{formatNaira(revenue.total)}</p>
          <p className="text-xs text-gray-400 mt-1">All revenue sources</p>
        </div>
      </div>

      {/* User Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">User Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Daily Active</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(userActivity.dailyActive)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weekly Active</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(userActivity.weeklyActive)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">New Signups (This Month)</p>
            <p className="text-xl font-bold text-blue-600">{formatNumber(userActivity.signupsThisMonth)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Retention Rate</p>
            <p className="text-xl font-bold text-green-600">{userActivity.retentionRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;