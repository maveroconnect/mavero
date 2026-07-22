// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
import {
  ShieldExclamationIcon,
  ArrowPathIcon,
  UserIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

/**
 * Protected Route Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} props.requiredRoles - Array of roles allowed to access (optional)
 * @param {string} props.redirectTo - Custom redirect path (default: '/login')
 * @param {string} props.unauthorizedRedirect - Redirect path when unauthorized (default: '/dashboard')
 */
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login',
  unauthorizedRedirect = '/dashboard',
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Simulate a brief check to prevent flash
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure auth state is stable
      const timer = setTimeout(() => setIsChecking(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return <AuthLoading />;
  }

  // Not authenticated - redirect to login with return URL
  if (!user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <UnauthorizedAccess role={user.role} redirectTo={unauthorizedRedirect} />;
  }

  // Account is active and authorized
  return children;
};

// ==================== Sub-Components ====================

// Loading Screen
const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Checking authentication...</h3>
        <p className="text-sm text-gray-500 mt-1">Please wait</p>
      </div>
    </div>
  );
};

// Unauthorized Access Screen
const UnauthorizedAccess = ({ role, redirectTo }) => {
  const getRoleDisplay = () => {
    switch (role) {
      case 'client': return 'Client';
      case 'provider': return 'Provider';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'client': return UserIcon;
      case 'provider': return BriefcaseIcon;
      case 'admin': return ShieldCheckIcon;
      default: return UserIcon;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/50 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldExclamationIcon className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <RoleIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Your Role</p>
              <p className="font-medium text-gray-900">{getRoleDisplay()}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Required Roles</p>
              <p className="font-medium text-gray-900">
                {requiredRoles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Go Home
          </a>
          <a
            href={redirectTo}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

// Export the required roles for use in other components
export const ROLES = {
  CLIENT: 'client',
  PROVIDER: 'provider',
  ADMIN: 'admin',
  ALL: ['client', 'provider', 'admin'],
};

export default ProtectedRoute;