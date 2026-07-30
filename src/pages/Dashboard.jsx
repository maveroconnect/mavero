// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import {
  HomeIcon,
  BriefcaseIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// ---------- Mock Data ----------
const mockStats = {
  client: {
    totalBookings: 12,
    activeBookings: 3,
    totalSpent: 4850,
    averageRating: 4.8,
  },
  provider: {
    totalJobs: 45,
    activeJobs: 5,
    totalEarnings: 38500,
    averageRating: 4.9,
    pendingPayments: 3200,
  },
  admin: {
    totalUsers: 1520,
    totalProviders: 320,
    totalJobs: 1240,
    totalRevenue: 125000,
    pendingVettings: 15,
  },
};

const mockRecentBookings = [
  {
    id: 1,
    service: 'Plumbing Repair',
    provider: 'John\'s Plumbing',
    date: '2024-01-15',
    status: 'completed',
    amount: 150,
  },
  {
    id: 2,
    service: 'Electrical Installation',
    provider: 'Spark Electric',
    date: '2024-01-12',
    status: 'active',
    amount: 450,
  },
  {
    id: 3,
    service: 'House Cleaning',
    provider: 'Clean Masters',
    date: '2024-01-10',
    status: 'pending',
    amount: 200,
  },
  {
    id: 4,
    service: 'HVAC Repair',
    provider: 'Cool Air Co.',
    date: '2024-01-08',
    status: 'completed',
    amount: 350,
  },
];

// ---------- Sidebar Navigation ----------
const navigation = {
  client: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Find Services', href: '/search', icon: BriefcaseIcon },
    { name: 'My Bookings', href: '/bookings', icon: CalendarIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ],
  provider: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'My Services', href: '/services', icon: BriefcaseIcon },
    { name: 'Booking Requests', href: '/requests', icon: CalendarIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Providers', href: '/admin/providers', icon: BriefcaseIcon },
    { name: 'Vetting Queue', href: '/admin/vetting', icon: DocumentTextIcon },
    { name: 'Disputes', href: '/admin/disputes', icon: ExclamationTriangleIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: CurrencyDollarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ],
};

// ---------- Dashboard Component ----------
const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Load role-specific data
    if (user?.role) {
      setStats(mockStats[user.role] || {});
      setRecentBookings(mockRecentBookings);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];
    return navigation[user.role] || navigation.client;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'active':
        return <ClockIcon className="w-4 h-4" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Role-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'Morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 17) timeOfDay = 'Evening';
    return `Good ${timeOfDay}, ${user?.firstName || 'User'}!`;
  };

  // Role-based stats cards configuration
  const getStatCards = () => {
    if (!user) return [];
    switch (user.role) {
      case 'client':
        return [
          { label: 'Total Bookings', value: stats.totalBookings || 0, icon: BriefcaseIcon, color: 'bg-blue-500' },
          { label: 'Active Bookings', value: stats.activeBookings || 0, icon: ClockIcon, color: 'bg-yellow-500' },
          { label: 'Total Spent', value: formatCurrency(stats.totalSpent || 0), icon: CurrencyDollarIcon, color: 'bg-green-500' },
          { label: 'Avg Rating', value: `${stats.averageRating || 0} ★`, icon: StarIcon, color: 'bg-purple-500' },
        ];
      case 'provider':
        return [
          { label: 'Total Jobs', value: stats.totalJobs || 0, icon: BriefcaseIcon, color: 'bg-blue-500' },
          { label: 'Active Jobs', value: stats.activeJobs || 0, icon: ClockIcon, color: 'bg-yellow-500' },
          { label: 'Total Earnings', value: formatCurrency(stats.totalEarnings || 0), icon: CurrencyDollarIcon, color: 'bg-green-500' },
          { label: 'Pending Payments', value: formatCurrency(stats.pendingPayments || 0), icon: WalletIcon, color: 'bg-orange-500' },
          { label: 'Avg Rating', value: `${stats.averageRating || 0} ★`, icon: StarIcon, color: 'bg-purple-500' },
        ];
      case 'admin':
        return [
          { label: 'Total Users', value: stats.totalUsers || 0, icon: UsersIcon, color: 'bg-blue-500' },
          { label: 'Total Providers', value: stats.totalProviders || 0, icon: BriefcaseIcon, color: 'bg-green-500' },
          { label: 'Total Jobs', value: stats.totalJobs || 0, icon: CalendarIcon, color: 'bg-purple-500' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: CurrencyDollarIcon, color: 'bg-yellow-500' },
          { label: 'Pending Vettings', value: stats.pendingVettings || 0, icon: DocumentTextIcon, color: 'bg-red-500' },
        ];
      default:
        return [];
    }
  };

  const statCards = getStatCards();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Mavero</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {getNavItems().map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                item.current
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.current ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">{getGreeting()}</h2>
            <p className="text-gray-600">
              Here's what's happening with your account today.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                    <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                      <Icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              );
            })}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getStatusBadge(booking.status)} bg-opacity-20`}>
                      {getStatusIcon(booking.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.service}</p>
                      <p className="text-sm text-gray-500">{booking.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                    <p className="text-sm text-gray-500">{booking.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {user?.role === 'client' && (
              <>
                <Link
                  to="/search"
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 transition"
                >
                  <MagnifyingGlassIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Find a Service</h4>
                  <p className="text-sm text-gray-600">Search for trusted providers</p>
                </Link>
                <Link
                  to="/bookings"
                  className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:bg-green-100 transition"
                >
                  <CalendarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">My Bookings</h4>
                  <p className="text-sm text-gray-600">View your bookings</p>
                </Link>
                <Link
                  to="/wallet"
                  className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center hover:bg-purple-100 transition"
                >
                  <WalletIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Wallet</h4>
                  <p className="text-sm text-gray-600">Manage your funds</p>
                </Link>
              </>
            )}
            {user?.role === 'provider' && (
              <>
                <Link
                  to="/services"
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 transition"
                >
                  <BriefcaseIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Manage Services</h4>
                  <p className="text-sm text-gray-600">Update your offerings</p>
                </Link>
                <Link
                  to="/requests"
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center hover:bg-yellow-100 transition"
                >
                  <ClockIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Booking Requests</h4>
                  <p className="text-sm text-gray-600">Review new requests</p>
                </Link>
                <Link
                  to="/wallet"
                  className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:bg-green-100 transition"
                >
                  <CurrencyDollarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Earnings</h4>
                  <p className="text-sm text-gray-600">View your earnings</p>
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/vetting"
                  className="bg-red-50 border border-red-200 rounded-xl p-6 text-center hover:bg-red-100 transition"
                >
                  <DocumentTextIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Vetting Queue</h4>
                  <p className="text-sm text-gray-600">Review pending providers</p>
                </Link>
                <Link
                  to="/admin/users"
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 transition"
                >
                  <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">User Management</h4>
                  <p className="text-sm text-gray-600">Manage all users</p>
                </Link>
                <Link
                  to="/admin/analytics"
                  className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center hover:bg-purple-100 transition"
                >
                  <CurrencyDollarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-600">View platform metrics</p>
                </Link>
              </>
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
            &copy; {new Date().getFullYear()} Mavero. All rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;