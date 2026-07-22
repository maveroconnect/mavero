// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/image/logo.jpeg';

import {
  UserIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  // Icons for categories
  WrenchScrewdriverIcon,
  SparklesIcon,
  BoltIcon,
  TruckIcon,
  WrenchIcon,
  PaintBrushIcon,
  HomeIcon,
  ScissorsIcon,
} from '@heroicons/react/24/outline';

// Password Strength Component
const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colors[strength - 1] || 'bg-gray-300'}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{labels[strength - 1] || 'Very Weak'}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Use 8+ characters with uppercase, lowercase, number, and special character.
      </p>
    </div>
  );
};

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Role, 2: Basic Info, 3: Provider Details
  const [role, setRole] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessDescription: '',
    categories: [],
    serviceRadius: 10,
    services: [{ name: '', description: '', price: '', duration: '' }],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Category list with icons – updated: HVAC → Mechanic, Landscaping → Tailoring
  const categories = [
    { name: 'Plumbing', icon: WrenchScrewdriverIcon },
    { name: 'Cleaning', icon: SparklesIcon },
    { name: 'Electrical', icon: BoltIcon },
    { name: 'Moving', icon: TruckIcon },
    { name: 'Mechanic', icon: WrenchIcon },
    { name: 'Painting', icon: PaintBrushIcon },
    { name: 'Carpentry', icon: HomeIcon },
    { name: 'Tailoring', icon: ScissorsIcon },
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', price: '', duration: '' }],
    }));
  };

  const removeService = (index) => {
    if (formData.services.length <= 1) return;
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleCategoryToggle = (categoryName) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter((c) => c !== categoryName)
        : [...prev.categories, categoryName],
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }
    if (step === 3 && role === 'provider') {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (formData.services.some((s) => !s.name || !s.price)) {
        newErrors.services = 'Each service must have a name and price';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 2 && role === 'client') {
        handleSubmit();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
        ...(role === 'provider' && {
          providerProfile: {
            businessName: formData.businessName,
            businessDescription: formData.businessDescription,
            categories: formData.categories,
            serviceRadius: formData.serviceRadius,
            services: formData.services.map((s) => ({
              name: s.name,
              description: s.description,
              price: parseFloat(s.price),
              duration: parseInt(s.duration) || 30,
            })),
          },
        }),
      };
      await registerUser(payload);
      setRegistrationSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || 'Registration failed. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/50"
        >
          {registrationSuccess ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center gap-2 ${
                        s === step ? 'text-blue-600' : s < step ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          s === step
                            ? 'border-blue-600 bg-blue-50'
                            : s < step
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {s < step ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">{s}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:inline ${
                          s === step ? 'text-blue-600' : s < step ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {s === 1 ? 'Role' : s === 2 ? 'Account' : 'Details'}
                      </span>
                      {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-green-600' : 'bg-gray-300'}`} />}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Step {step} of {role === 'provider' ? 3 : 2}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
                    <p className="text-gray-600 mb-8">How do you want to use Mavero?</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <button
                        onClick={() => handleRoleSelect('client')}
                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                          role === 'client'
                            ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              role === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            } group-hover:scale-105 transition`}
                          >
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">I Need a Service</h3>
                            <p className="text-gray-500 text-sm mt-1">Find and hire trusted local professionals</p>
                            <ul className="mt-3 space-y-1 text-sm text-gray-600">
                              <li>✓ Browse vetted providers</li>
                              <li>✓ Secure escrow payments</li>
                              <li>✓ In-app messaging</li>
                            </ul>
                          </div>
                        </div>
                        {role === 'client' && (
                          <div className="absolute top-4 right-4">
                            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => handleRoleSelect('provider')}
                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                          role === 'provider'
                            ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              role === 'provider' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            } group-hover:scale-105 transition`}
                          >
                            <BriefcaseIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">I Provide Services</h3>
                            <p className="text-gray-500 text-sm mt-1">Offer your services and grow your business</p>
                            <ul className="mt-3 space-y-1 text-sm text-gray-600">
                              <li>✓ Get verified and trusted</li>
                              <li>✓ Access to clients</li>
                              <li>✓ Secure payments</li>
                            </ul>
                          </div>
                        </div>
                        {role === 'provider' && (
                          <div className="absolute top-4 right-4">
                            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </button>
                    </div>

                    {errors.submit && <p className="mt-4 text-sm text-red-600">{errors.submit}</p>}

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!role}
                        className={`px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition ${
                          role
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Next Step <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Account Information */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                    <p className="text-gray-600 mb-8">Fill in your personal details</p>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.firstName
                                  ? 'border-red-500 focus:ring-red-200'
                                  : 'border-gray-300 focus:ring-blue-200'
                              }`}
                              placeholder="John"
                            />
                            <UserCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          </div>
                          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.lastName
                                  ? 'border-red-500 focus:ring-red-200'
                                  : 'border-gray-300 focus:ring-blue-200'
                              }`}
                              placeholder="Doe"
                            />
                            <UserCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          </div>
                          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.email
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="john@example.com"
                          />
                          <EnvelopeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.phone
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="+1 (555) 000-0000"
                          />
                          <PhoneIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.password
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="Min 8 characters"
                          />
                          <LockClosedIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        <PasswordStrength password={formData.password} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.confirmPassword
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="Confirm your password"
                          />
                          <LockClosedIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handleBack}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                      >
                        {role === 'provider' ? 'Next: Business Details' : 'Create Account'}
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Provider Details */}
                {step === 3 && role === 'provider' && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
                    <p className="text-gray-600 mb-8">Help clients find you</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.businessName
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="Your business name"
                          />
                          <BuildingOfficeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                        <textarea
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Tell clients about your business..."
                        />
                      </div>

                      {/* Updated Categories with Icons */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                        <div className="flex flex-wrap gap-3">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.name}
                                type="button"
                                onClick={() => handleCategoryToggle(cat.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                                  formData.categories.includes(cat.name)
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                {cat.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Radius (miles)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="serviceRadius"
                            value={formData.serviceRadius}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            min="1"
                            max="100"
                          />
                          <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                        {formData.services.map((service, index) => (
                          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Service Name</label>
                                <input
                                  type="text"
                                  value={service.name}
                                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                  placeholder="e.g., Faucet Repair"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Price (₦)</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1.5 text-gray-500">₦</span>
                                  <input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                    className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="5000"
                                    min="0"
                                    step="100"
                                  />
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <input
                                  type="text"
                                  value={service.description}
                                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                  placeholder="Brief description"
                                />
                              </div>
                            </div>
                            {formData.services.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                              >
                                Remove Service
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addService}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          + Add Another Service
                        </button>
                        {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handleBack}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">⏳</span> Creating...
                          </>
                        ) : (
                          <>
                            Create Account <ArrowRightIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;