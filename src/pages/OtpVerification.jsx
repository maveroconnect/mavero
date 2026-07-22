// src/pages/OtpVerification.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/image/logo.jpeg';

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the identifier (email or phone) from location state
  const identifier = location.state?.identifier || '';
  const method = location.state?.method || 'email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Refs for input fields
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Clear errors
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: '' }));
    }
    if (verificationError) setVerificationError('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setOtp(digits);
    // Focus last input
    inputRefs.current[5].focus();
  };

  const validateOtp = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrors({ otp: 'Please enter all 6 digits' });
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (!validateOtp()) return;

    setIsVerifying(true);
    setVerificationError('');
    try {
      // Simulate API call – replace with actual backend request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, this would be a real OTP verification
      // For demo, we'll accept any 6-digit code
      setIsVerified(true);
      setTimeout(() => {
        navigate('/reset-password', { state: { identifier, method } });
      }, 2000);
    } catch (error) {
      setVerificationError('Invalid or expired OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      // Simulate API call – replace with actual backend request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset timer
      setTimeLeft(60);
      setCanResend(false);
      setVerificationError('');
      // Show success message (optional)
    } catch (error) {
      setVerificationError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (isVerified) {
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verified!</h2>
            <p className="text-gray-600">
              Your account has been verified. Redirecting to reset password...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

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

        {/* OTP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/50"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify Your Identity</h2>
          <p className="text-gray-600 text-center mb-6">
            We've sent a 6-digit verification code to your{' '}
            <span className="font-medium text-blue-600">
              {method === 'email' ? 'email' : 'phone'}
            </span>
            .
          </p>

          {/* Identifier display */}
          <div className="bg-gray-50 rounded-lg p-3 text-center mb-6 border border-gray-200">
            <span className="text-sm text-gray-500">Sending to:</span>
            <span className="ml-2 text-sm font-medium text-gray-800">
              {identifier}
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border rounded-xl focus:outline-none focus:ring-2 transition ${
                      errors.otp || verificationError
                        ? 'border-red-500 focus:ring-red-200'
                        : digit
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
              )}
              {verificationError && (
                <p className="mt-2 text-sm text-red-600 text-center">{verificationError}</p>
              )}
            </div>

            {/* Timer & Resend */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-500">
                {!canResend ? (
                  <span>
                    Resend code in <span className="font-semibold text-blue-600">{timeLeft}s</span>
                  </span>
                ) : (
                  <span className="text-green-600">Code expired. Request a new one.</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`text-sm font-medium transition ${
                  canResend && !isResending
                    ? 'text-blue-600 hover:text-blue-800 hover:underline'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {isResending ? (
                  <span className="flex items-center gap-1">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Reset Password
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpVerification;