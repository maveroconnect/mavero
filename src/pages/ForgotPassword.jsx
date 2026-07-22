// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/image/logo.jpeg';

import {
  EnvelopeIcon,
  PhoneIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (resetMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Simulate API call – replace with actual backend request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // On success, show confirmation screen
      setSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    return resetMethod === 'email'
      ? 'john@example.com'
      : '+1 (555) 000-0000';
  };

  const getInputName = () => resetMethod === 'email' ? 'email' : 'phone';
  const getInputValue = () => resetMethod === 'email' ? formData.email : formData.phone;

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img src={logo} alt="Mavero" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                Mavero
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/50 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your {resetMethod === 'email' ? 'Inbox' : 'Phone'}</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your{' '}
              {resetMethod === 'email' ? 'email address' : 'phone number'}.
              Please follow the instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Reset request form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img src={logo} alt="Mavero" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              Mavero
            </span>
          </Link>
        </div>

        {/* Reset Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/50"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Reset Password</h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your {resetMethod === 'email' ? 'email address' : 'phone number'} to receive a reset link.
          </p>

          {/* Method Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setResetMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                resetMethod === 'email'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <EnvelopeIcon className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setResetMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                resetMethod === 'phone'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PhoneIcon className="w-4 h-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                {resetMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  name={getInputName()}
                  type={resetMethod === 'email' ? 'email' : 'tel'}
                  value={getInputValue()}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[getInputName()]
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder={getPlaceholder()}
                />
                {resetMethod === 'email' ? (
                  <EnvelopeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                ) : (
                  <PhoneIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                )}
              </div>
              {errors[getInputName()] && (
                <p className="mt-1 text-sm text-red-600">{errors[getInputName()]}</p>
              )}
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;