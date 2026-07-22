import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";  // named import
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ProviderProfile from './pages/ProviderProfile';
import Booking from './pages/Booking';
import Wallet from './pages/Wallet';
import Messages from './pages/Messages';
import Home from './pages/Homepage'
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import Settings from './pages/Settings';
import ProviderRegistration from './pages/ProviderRegistration';


// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VettingDashboard from './pages/admin/VettingDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminSidebar from './pages/admin/AdminSidebar'
import DisputeResolution from './pages/admin/DisputeResolution';
import EscrowManagement from './pages/admin/EscrowManagement';
import TransactionAudit from './pages/admin/TransactionAudit';
import ReviewModeration from './pages/admin/ReviewModeration';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';
import CompletionCodesAudit from './pages/admin/CompletionCodesAudit';

// Styles
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-white">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/otpverification" element={<OtpVerification />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } />
                  <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/provider/:id" element={
                  <ProtectedRoute>
                    <ProviderProfile />
                  </ProtectedRoute>
                } />
                <Route path="/booking" element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } />
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />
                  <Route path="/Home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/ProviderRegistration" element={
                  <ProtectedRoute>
                    <ProviderRegistration />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                  <Route path="/admin/DisputeResolution" element={
                  <ProtectedRoute requiredRole="admin">
                    <DisputeResolution />
                  </ProtectedRoute>
                } />
                  <Route path="/admin/EscrowManagement" element={
                  <ProtectedRoute requiredRole="admin">
                    <EscrowManagement />
                  </ProtectedRoute>
                } />
                  <Route path="/admin/TransactionAudit" element={
                  <ProtectedRoute requiredRole="admin">
                    <TransactionAudit />
                  </ProtectedRoute>
                } />
                 <Route path="/admin/vetting" element={
                  <ProtectedRoute requiredRole="admin">
                    <VettingDashboard />
                  </ProtectedRoute>
                } />
                  <Route path="/admin/admin-layout" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                } />
                  <Route path="/admin/Admin-sidebar" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSidebar />
                  </ProtectedRoute>
                } />
                <Route path="/admin/ReviewModeration" element={
                  <ProtectedRoute requiredRole="admin">
                    <ReviewModeration />
                  </ProtectedRoute>
                } />
                <Route path="/admin/CompletionCodesAudit" element={
                  <ProtectedRoute requiredRole="admin">
                    <CompletionCodesAudit />
                  </ProtectedRoute>
                } />
                <Route path="/admin/PlatformAnalytics" element={
                  <ProtectedRoute requiredRole="admin">
                    < PlatformAnalytics/>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background: '#22c55e',
                      color: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                  },
                }}
              />
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;