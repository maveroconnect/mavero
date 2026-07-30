// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  WalletIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isMobile, onClose }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    bookings: true,
    users: false,
    payments: true,
  });

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    {
      type: 'link',
      label: 'Dashboard',
      icon: HomeIcon,
      path: '/admin',
      exact: true,
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      label: 'Management',
    },
    {
      type: 'link',
      label: 'Vetting Queue',
      icon: ShieldCheckIcon,
      path: '/admin/vetting',
      badge: '23',
    },
    {
      type: 'link',
      label: 'Dispute Resolution',
      icon: ExclamationTriangleIcon,
      path: '/admin/disputes',
      badge: '12',
    },
    {
      type: 'link',
      label: 'Review Moderation',
      icon: StarIcon,
      path: '/admin/reviews',
      badge: '8',
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      label: 'Monitoring',
    },
    {
      type: 'link',
      label: 'All Bookings',
      icon: BriefcaseIcon,
      path: '/admin/bookings',
    },
    {
      type: 'link',
      label: 'Escrow Management',
      icon: WalletIcon,
      path: '/admin/escrow',
    },
    {
      type: 'link',
      label: 'Transaction Audit',
      icon: CurrencyDollarIcon,
      path: '/admin/transactions',
    },
    {
      type: 'link',
      label: 'Completion Codes',
      icon: ClockIcon,
      path: '/admin/completion-codes',
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      label: 'Analytics',
    },
    {
      type: 'link',
      label: 'Platform Analytics',
      icon: ChartBarIcon,
      path: '/admin/analytics',
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      label: 'Settings',
    },
    {
      type: 'link',
      label: 'Business Rules',
      icon: Cog6ToothIcon,
      path: '/admin/settings',
    },
  ];

  const renderNavItem = (item, index) => {
    if (item.type === 'divider') {
      return <hr key={`divider-${index}`} className="my-3 border-gray-700/50" />;
    }

    if (item.type === 'heading') {
      return (
        <div key={`heading-${index}`} className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
        </div>
      );
    }

    if (item.type === 'link') {
      const Icon = item.icon;
      const active = isActive(item.path);
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => {
            if (isMobile && onClose) onClose();
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            active
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
          }`}
        >
          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              active ? 'bg-white/20 text-white' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {item.badge}
            </span>
          )}
        </Link>
      );
    }

    return null;
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-gray-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700/50">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-bold text-white">Mavero Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{user?.firstName || 'Admin'}</p>
              <p className="text-xs text-gray-400">{user?.email || 'admin@mavero.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, index) => renderNavItem(item, index))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-700/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-xl transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="w-64 bg-gray-900 text-white h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-700/50">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <span className="text-lg font-bold text-white">Mavero</span>
            <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <UserCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate">{user?.firstName || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@mavero.com'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item, index) => renderNavItem(item, index))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-xl transition"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          v1.0.0 • © 2026 Mavero
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;