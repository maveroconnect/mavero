// src/pages/ProviderRegistration.jsx (FIXED FULL VERSION)
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  TruckIcon,
  HomeModernIcon,
  PaintBrushIcon,
  BoltIcon,
  ScissorsIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Service categories for selection
const serviceCategories = [
  { id: 'plumbing', label: 'Plumbing', icon: WrenchScrewdriverIcon },
  { id: 'cleaning', label: 'Cleaning', icon: SparklesIcon },
  { id: 'electrical', label: 'Electrical', icon: BoltIcon },
  { id: 'moving', label: 'Moving', icon: TruckIcon },
  { id: 'hvac', label: 'HVAC', icon: HomeModernIcon },
  { id: 'painting', label: 'Painting', icon: PaintBrushIcon },
  { id: 'gardening', label: 'Gardening', icon: ScissorsIcon },
  { id: 'general', label: 'General Services', icon: BuildingOfficeIcon },
];

// Helper to format Naira (for display only)
const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Personal & Business Info
  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '+234 ',
    businessName: '',
    businessDescription: '',
    categories: [],
    yearsOfExperience: '',
    serviceRadius: 20,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  // Step 2: Services
  const [services, setServices] = useState([
    { id: Date.now(), name: '', description: '', price: '', duration: '' },
  ]);

  // Step 3: Documents (just file names for mock)
  const [documents, setDocuments] = useState({
    idCard: null,
    license: null,
    insurance: null,
    backgroundConsent: null,
  });

  // UI state for step validation
  const [errors, setErrors] = useState({});

  // Refs for file inputs
  const fileInputRefs = {
    idCard: useRef(null),
    license: useRef(null),
    insurance: useRef(null),
    backgroundConsent: useRef(null),
  };

  // ----- Step Navigation -----
  const totalSteps = 4;

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ----- Validation per step -----
  const validateStep = (step) => {
    let newErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!personalData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!personalData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!personalData.email.trim() || !/\S+@\S+\.\S+/.test(personalData.email)) {
        newErrors.email = 'Valid email is required';
        isValid = false;
      }
      if (!personalData.phone.trim() || personalData.phone.length < 10) {
        newErrors.phone = 'Valid phone number is required';
        isValid = false;
      }
      if (!personalData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
        isValid = false;
      }
      if (!personalData.businessDescription.trim()) {
        newErrors.businessDescription = 'Business description is required';
        isValid = false;
      }
      if (personalData.categories.length === 0) {
        newErrors.categories = 'Select at least one category';
        isValid = false;
      }
      if (!personalData.yearsOfExperience || personalData.yearsOfExperience < 0) {
        newErrors.yearsOfExperience = 'Valid years of experience is required';
        isValid = false;
      }
      if (!personalData.address.city.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      }
      if (!personalData.address.state.trim()) {
        newErrors.state = 'State is required';
        isValid = false;
      }
    }

    if (step === 1) {
      services.forEach((service, index) => {
        if (!service.name.trim()) {
          newErrors[`service_${index}_name`] = 'Service name is required';
          isValid = false;
        }
        if (!service.price || isNaN(service.price) || Number(service.price) <= 0) {
          newErrors[`service_${index}_price`] = 'Valid price is required';
          isValid = false;
        }
        if (!service.duration || isNaN(service.duration) || Number(service.duration) <= 0) {
          newErrors[`service_${index}_duration`] = 'Valid duration is required';
          isValid = false;
        }
      });
    }

    if (step === 2) {
      if (!documents.idCard) {
        newErrors.idCard = 'ID card is required';
        isValid = false;
      }
      if (!documents.license) {
        newErrors.license = 'License is required';
        isValid = false;
      }
      if (!documents.insurance) {
        newErrors.insurance = 'Insurance certificate is required';
        isValid = false;
      }
      if (!documents.backgroundConsent) {
        newErrors.backgroundConsent = 'Background consent form is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (!isValid) {
      toast.error('Please fix the errors before proceeding');
    }
    return isValid;
  };

  // ----- Handlers for personal data -----
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setPersonalData(prev => {
      const current = prev.categories;
      if (current.includes(categoryId)) {
        return { ...prev, categories: current.filter(c => c !== categoryId) };
      } else {
        return { ...prev, categories: [...current, categoryId] };
      }
    });
  };

  // ----- Handlers for services -----
  const addService = () => {
    setServices([...services, { id: Date.now(), name: '', description: '', price: '', duration: '' }]);
  };

  const removeService = (id) => {
    if (services.length === 1) {
      toast.error('You need at least one service');
      return;
    }
    setServices(services.filter(s => s.id !== id));
  };

  const handleServiceChange = (id, field, value) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // ----- Handlers for documents -----
  const handleFileChange = (docType, file) => {
    if (file) {
      setDocuments(prev => ({ ...prev, [docType]: file }));
      if (errors[docType]) {
        setErrors(prev => ({ ...prev, [docType]: '' }));
      }
    }
  };

  const removeDocument = (docType) => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
    if (fileInputRefs[docType]?.current) {
      fileInputRefs[docType].current.value = '';
    }
  };

  // ----- Submission -----
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    const payload = {
      ...personalData,
      services: services.map(s => ({
        name: s.name,
        description: s.description || '',
        price: Number(s.price),
        duration: Number(s.duration),
      })),
      documents: {
        idCard: documents.idCard ? documents.idCard.name : null,
        license: documents.license ? documents.license.name : null,
        insurance: documents.insurance ? documents.insurance.name : null,
        backgroundConsent: documents.backgroundConsent ? documents.backgroundConsent.name : null,
      },
    };

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Provider registration payload:', payload);
      toast.success('Provider application submitted for review!');
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----- Render Step Content -----
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderServices();
      case 2:
        return renderDocuments();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

  // ----- Step 0: Personal & Business Info -----
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={personalData.firstName}
            onChange={handlePersonalChange}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={personalData.lastName}
            onChange={handlePersonalChange}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={personalData.email}
            onChange={handlePersonalChange}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={personalData.phone}
            onChange={handlePersonalChange}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={personalData.businessName}
          onChange={handlePersonalChange}
          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors.businessName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="businessDescription"
          rows={3}
          value={personalData.businessDescription}
          onChange={handlePersonalChange}
          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
            errors.businessDescription ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your services and what makes you unique..."
        />
        {errors.businessDescription && <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Categories <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {serviceCategories.map(cat => {
            const Icon = cat.icon;
            const isSelected = personalData.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryToggle(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
        {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={personalData.yearsOfExperience}
            onChange={handlePersonalChange}
            min={0}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Radius (km) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="serviceRadius"
            value={personalData.serviceRadius}
            onChange={handlePersonalChange}
            min={1}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 mb-3">Business Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              name="street"
              value={personalData.address.street}
              onChange={handleAddressChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="city"
              value={personalData.address.city}
              onChange={handleAddressChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="state"
              value={personalData.address.state}
              onChange={handleAddressChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={personalData.address.zipCode}
              onChange={handleAddressChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ----- Step 1: Services -----
  const renderServices = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">List the services you offer. Add at least one service.</p>

      <AnimatePresence>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">Service #{index + 1}</h4>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors[`service_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Pipe Repair"
                />
                {errors[`service_${index}_name`] && <p className="mt-1 text-sm text-red-600">{errors[`service_${index}_name`]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={service.description}
                  onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                  min={0}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors[`service_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 8500"
                />
                {errors[`service_${index}_price`] && <p className="mt-1 text-sm text-red-600">{errors[`service_${index}_price`]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={service.duration}
                  onChange={(e) => handleServiceChange(service.id, 'duration', e.target.value)}
                  min={1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors[`service_${index}_duration`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 60"
                />
                {errors[`service_${index}_duration`] && <p className="mt-1 text-sm text-red-600">{errors[`service_${index}_duration`]}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={addService}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <PlusIcon className="w-5 h-5" />
        Add Another Service
      </button>
    </div>
  );

  // ----- Step 2: Documents -----
  const renderDocuments = () => {
    const docFields = [
      { key: 'idCard', label: 'ID Card (National ID, Passport, etc.)', required: true },
      { key: 'license', label: 'Professional License', required: true },
      { key: 'insurance', label: 'Insurance Certificate', required: true },
      { key: 'backgroundConsent', label: 'Background Check Consent Form', required: true },
    ];

    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500">Upload the required documents for verification. All files must be clear and readable.</p>

        {docFields.map(({ key, label, required }) => (
          <div key={key} className="border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="font-medium text-gray-800">{label}</label>
                {required && <span className="text-red-500 ml-1">*</span>}
                {documents[key] && (
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    {documents[key].name}
                  </p>
                )}
                {errors[key] && <p className="text-sm text-red-600 mt-1">{errors[key]}</p>}
              </div>
              <div className="flex items-center gap-2">
                {documents[key] ? (
                  <button
                    type="button"
                    onClick={() => removeDocument(key)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs[key].current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    <PhotoIcon className="w-5 h-5 inline mr-1" />
                    Upload
                  </button>
                )}
                <input
                  ref={fileInputRefs[key]}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileChange(key, file);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 flex items-start gap-2">
          <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Your documents are secure and will only be used for verification purposes.</p>
        </div>
      </div>
    );
  };

  // ----- Step 3: Review & Submit -----
  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
        <h3 className="font-semibold flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          Review Your Application
        </h3>
        <p className="text-sm mt-1">Please review all information before submitting. Once submitted, our team will review your application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Personal Information
          </h4>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="text-gray-500">Name:</span> {personalData.firstName} {personalData.lastName}</p>
            <p><span className="text-gray-500">Email:</span> {personalData.email}</p>
            <p><span className="text-gray-500">Phone:</span> {personalData.phone}</p>
            <p><span className="text-gray-500">Experience:</span> {personalData.yearsOfExperience} years</p>
            <p><span className="text-gray-500">Service Radius:</span> {personalData.serviceRadius} km</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            Business Information
          </h4>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="text-gray-500">Business Name:</span> {personalData.businessName}</p>
            <p><span className="text-gray-500">Description:</span> {personalData.businessDescription}</p>
            <p><span className="text-gray-500">Categories:</span> {personalData.categories.map(id => serviceCategories.find(c => c.id === id)?.label).join(', ')}</p>
            <p><span className="text-gray-500">Address:</span> {personalData.address.city}, {personalData.address.state}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600" />
            Services ({services.length})
          </h4>
          <div className="mt-2 space-y-2">
            {services.map((s, idx) => (
              <div key={s.id} className="border-b border-gray-200 last:border-0 py-2 text-sm flex justify-between">
                <div>
                  <span className="font-medium">{s.name}</span>
                  {s.description && <span className="text-gray-500 ml-2">- {s.description}</span>}
                </div>
                <div>
                  <span className="text-blue-600 font-medium">{formatNaira(s.price)}</span>
                  <span className="text-gray-400 ml-2">{s.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            Documents Uploaded
          </h4>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(documents).map(([key, file]) => (
              <div key={key} className="flex items-center gap-2">
                {file ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-gray-600">{file.name}</span>
                  </>
                ) : (
                  <span className="text-red-500">Missing</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ----- Render Step Indicator -----
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[...Array(totalSteps)].map((_, idx) => (
        <div key={idx} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
              idx === currentStep
                ? 'bg-blue-600 text-white'
                : idx < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {idx < currentStep ? <CheckCircleIcon className="w-5 h-5" /> : idx + 1}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`w-10 h-0.5 transition ${
                idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // ----- Main Render -----
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="text-gray-600 mt-2">
            Your provider application has been received. Our team will review your documents and get back to you within 2-3 business days.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Become a Provider</h1>
            <p className="text-blue-100 mt-1">Join Mavero and start offering your services</p>
          </div>

          <div className="px-6 pt-6">
            {renderStepIndicator()}
          </div>

          <div className="px-6 pb-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep === 0 && 'Step 1: Personal & Business Info'}
                {currentStep === 1 && 'Step 2: Your Services'}
                {currentStep === 2 && 'Step 3: Upload Documents'}
                {currentStep === 3 && 'Step 4: Review & Submit'}
              </h2>
            </div>

            {renderStepContent()}

            <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2.5 rounded-xl font-medium transition ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={currentStep === 0}
              >
                <ChevronLeftIcon className="w-5 h-5 inline mr-1" />
                Back
              </button>

              {currentStep === totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircleIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Next
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By submitting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default ProviderRegistration;