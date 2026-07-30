// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BriefcaseIcon,
  WalletIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,    // ✅ Fixed
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  EyeIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA (Nigerian Naira)
// ----------------------------

// Dashboard stats
const mockStats = {
  totalUsers: 15473,
  totalProviders: 2108,
  totalClients: 13365,
  totalBookings: 10428,
  totalEscrowBalance: 284500000, // ₦284.5M
  totalCommissionEarned: 12560000, // ₦12.56M
  totalInterestEarned: 4500000, // ₦4.5M
  pendingVetting: 23,
  activeDisputes: 12,
  pendingReviews: 8,
  completedJobsToday: 142,
  completedJobsWeek: 847,
  completedJobsMonth: 3256,
  revenueGrowth: 12.8,
  userGrowth: 8.4,
  bookingGrowth: 15.2,
  approvalRate: 92,
};

// Recent bookings
const mockRecentBookings = [
  {
    id: 'bk1',
    service: 'Pipe Repair',
    client: 'Sarah Adebayo',
    provider: 'John\'s Plumbing',
    amount: 8500,
    status: 'completed',
    date: '2026-07-21T14:30:00',
  },
  {
    id: 'bk2',
    service: 'Deep Cleaning',
    client: 'Michael Okafor',
    provider: 'Clean & Shine',
    amount: 12000,
    status: 'active',
    date: '2026-07-21T11:15:00',
  },
  {
    id: 'bk3',
    service: 'AC Installation',
    client: 'Chioma Eze',
    provider: 'CoolBreeze HVAC',
    amount: 35000,
    status: 'pending',
    date: '2026-07-21T09:45:00',
  },
  {
    id: 'bk4',
    service: 'Electrical Wiring',
    client: 'Bola Tinubu',
    provider: 'Spark Electric',
    amount: 15000,
    status: 'completed',
    date: '2026-07-20T16:20:00',
  },
  {
    id: 'bk5',
    service: 'Garden Design',
    client: 'Emeka Nwosu',
    provider: 'Green Thumb',
    amount: 22000,
    status: 'disputed',
    date: '2026-07-20T13:10:00',
  },
];

// Pending vetting applications
const mockPendingVetting = [
  { id: 'v1', name: 'Chidi\'s Plumbing', date: '2026-07-21T10:30:00', category: 'Plumbing' },
  { id: 'v2', name: 'Amina\'s Cleaning', date: '2026-07-21T09:15:00', category: 'Cleaning' },
  { id: 'v3', name: 'Emeka Electrical', date: '2026-07-20T16:45:00', category: 'Electrical' },
  { id: 'v4', name: 'Grace Painting Co.', date: '2026-07-20T14:20:00', category: 'Painting' },
];

// Activity feed
const mockActivity = [
  { id: 'a1', action: 'New provider registration', user: 'Chidi Okafor', time: '2 min ago', type: 'registration' },
  { id: 'a2', action: 'Booking completed', user: 'Sarah Adebayo', time: '15 min ago', type: 'booking' },
  { id: 'a3', action: 'Dispute raised', user: 'Emeka Nwosu', time: '1 hour ago', type: 'dispute' },
  { id: 'a4', action: 'Review flagged', user: 'Anonymous', time: '2 hours ago', type: 'review' },
  { id: 'a5', action: 'Payment released from escrow', user: 'John\'s Plumbing', time: '3 hours ago', type: 'payment' },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatShortNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status) => {
  const badges = {
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    disputed: { color: 'bg-red-100 text-red-800', label: 'Disputed' },
    cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
  };
  return badges[status] || badges.pending;
};

const getActivityIcon = (type) => {
  const icons = {
    registration: UserPlusIcon,
    booking: BriefcaseIcon,
    dispute: ExclamationTriangleIcon,
    review: StarIcon,
    payment: CurrencyDollarIcon,
  };
  return icons[type] || DocumentTextIcon;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);
  const [recentBookings, setRecentBookings] = useState(mockRecentBookings);
  const [pendingVetting, setPendingVetting] = useState(mockPendingVetting);
  const [activity, setActivity] = useState(mockActivity);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle quick actions
  const handleQuickAction = (action) => {
    toast.success(`Navigating to ${action}...`);
    if (action === 'Review Vetting') {
      navigate('/admin/vetting');
    } else if (action === 'Manage Disputes') {
      navigate('/admin/disputes');
    } else if (action === 'View Analytics') {
      navigate('/admin/analytics');
    } else if (action === 'Business Settings') {
      navigate('/admin/settings');
    } else if (action === 'Escrow Management') {
      navigate('/admin/escrow');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.firstName || 'Admin'}! Here's what's happening on Mavero.</p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              Last updated: {new Date().toLocaleTimeString('en-NG')}
            </span>
            <button
              onClick={() => {
                toast.success('Dashboard refreshed');
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 500);
              }}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatShortNumber(stats.totalUsers)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
              {stats.userGrowth}% this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Providers</p>
                <p className="text-2xl font-bold text-gray-900">{formatShortNumber(stats.totalProviders)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-xl">
                <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
              <ClockIcon className="w-3 h-3" />
              {stats.pendingVetting} pending vetting
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Escrow Balance</p>
                <p className="text-2xl font-bold text-green-600">{formatShortNumber(stats.totalEscrowBalance)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-xl">
                <WalletIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              Interest: {formatNaira(stats.totalInterestEarned)} earned
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Commission</p>
                <p className="text-2xl font-bold text-blue-600">{formatShortNumber(stats.totalCommissionEarned)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
              +12.8% this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{formatShortNumber(stats.totalBookings)}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-xl">
                <BriefcaseIcon className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <ArrowTrendingUpIcon className="w-3 h-3" />  {/* ✅ Fixed */}
              {stats.bookingGrowth}% this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Approval Rate</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.approvalRate}%</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              {stats.pendingVetting} applications pending
            </div>
          </motion.div>
        </div>

        {/* Charts / Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Trends (mock chart) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Booking Trends</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  Pending
                </span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-1 pt-4">
              {[65, 82, 58, 94, 78, 105, 92, 118, 85, 96, 72, 88].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-blue-600 rounded-t-sm"
                      style={{ height: (val / 120) * 120 + 'px' }}
                    />
                    <div
                      className="w-full bg-gray-300 rounded-b-sm"
                      style={{ height: (Math.max(0, 30 - val / 4)) + 'px' }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">W{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Recent Metrics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Jobs Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobsToday}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobsWeek}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobsMonth}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Active Disputes</p>
                <p className="text-2xl font-bold text-red-600">{stats.activeDisputes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentBookings.slice(0, 5).map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{booking.service}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{booking.client}</span>
                        <span>•</span>
                        <span>{booking.provider}</span>
                        <span>•</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{formatNaira(booking.amount)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Pending Tasks & Activity */}
          <div className="space-y-6">
            {/* Pending Vetting */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pending Vetting</h3>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                  {stats.pendingVetting}
                </span>
              </div>
              <div className="space-y-3">
                {pendingVetting.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{app.name}</p>
                      <p className="text-xs text-gray-400">{app.category} • {formatDate(app.date)}</p>
                    </div>
                    <Link
                      to="/admin/vetting"
                      className="text-xs text-blue-600 hover:text-blue-700 transition"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/vetting"
                className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 transition"
              >
                View all pending applications →
              </Link>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activity.slice(0, 4).map((item) => {
                  const Icon = getActivityIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{item.action}</p>
                        <p className="text-xs text-gray-400">{item.user} • {item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Review Vetting', icon: UserPlusIcon, color: 'bg-blue-50 text-blue-600' },
              { label: 'Manage Disputes', icon: ExclamationTriangleIcon, color: 'bg-red-50 text-red-600' },
              { label: 'Escrow Management', icon: WalletIcon, color: 'bg-green-50 text-green-600' },
              { label: 'View Analytics', icon: ArrowTrendingUpIcon, color: 'bg-purple-50 text-purple-600' },  // ✅ Fixed
              { label: 'Business Settings', icon: Cog6ToothIcon, color: 'bg-gray-50 text-gray-600' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition hover:shadow-md ${action.color}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;