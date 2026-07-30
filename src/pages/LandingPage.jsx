// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/image/logo.jpeg';

import {
  MagnifyingGlassIcon as SearchIcon,
  UserIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  MapPinIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronDownIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  PhoneIcon,
  PaintBrushIcon,
  ScissorsIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

// ---------- Data ----------
const serviceCategories = [
  { id: 1, name: 'Plumbing', icon: WrenchScrewdriverIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 2, name: 'Cleaning', icon: SparklesIcon, color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Electrical', icon: BuildingOfficeIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, name: 'Moving', icon: TruckIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 5, name: 'HVAC', icon: HomeModernIcon, color: 'bg-red-100 text-red-600' },
  { id: 6, name: 'Painting', icon: PaintBrushIcon, color: 'bg-pink-100 text-pink-600' },
];

const steps = [
  {
    icon: SearchIcon,
    title: 'Search & Discover',
    description: 'Browse vetted providers in your area',
    details: 'Use filters to find the perfect match'
  },
  {
    icon: UserIcon,
    title: 'Review Profiles',
    description: 'Check ratings, reviews, and credentials',
    details: 'See verified badges and past work'
  },
  {
    icon: CreditCardIcon,
    title: 'Book & Pay Securely',
    description: 'Funds held in escrow until completion',
    details: 'Your money is safe with our secure system'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Communicate Directly',
    description: 'Chat with your provider in-app',
    details: 'Share details and get real-time updates'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Service & Confirm',
    description: 'Get the job done and release payment',
    details: 'Enter the completion code to release funds'
  },
  {
    icon: StarIcon,
    title: 'Rate & Review',
    description: 'Help others by sharing your experience',
    details: 'Build trust in the community'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=80',
    content: 'Mavero made it so easy to find a reliable plumber. The escrow system gave me peace of mind knowing my money was safe until the job was done perfectly.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Small Business Owner',
    image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=6366f1&color=fff&size=80',
    content: 'As a business owner, finding vetted contractors was always a challenge. Mavero\'s verification process saved me time and ensured quality work.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Property Manager',
    image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6366f1&color=fff&size=80',
    content: 'Managing multiple properties requires reliable service providers. Mavero\'s platform has been a game-changer for finding trusted professionals quickly.',
    rating: 5
  }
];

const stats = [
  { number: '50,000+', label: 'Active Users' },
  { number: '10,000+', label: 'Vetted Providers' },
  { number: '100,000+', label: 'Jobs Completed' },
  { number: '98%', label: 'Satisfaction Rate' }
];

// About Page Data
const values = [
  { icon: ShieldCheckIcon, title: 'Trust & Transparency', description: 'We believe in complete transparency with our users, from pricing to provider verification.' },
  { icon: UserIcon, title: 'Community First', description: 'Building a community of trusted professionals and satisfied customers is our priority.' },
  { icon: SparklesIcon, title: 'Customer Obsession', description: 'Every decision we make is driven by what\'s best for our users.' },
  { icon: RocketLaunchIcon, title: 'Innovation', description: 'Continuously improving our platform to make finding services easier than ever.' },
];

const team = [
  { name: 'Alex Rivera', role: 'CEO & Co-founder', image: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=4f46e5&color=fff&size=120' },
  { name: 'Jamie Chen', role: 'CTO & Co-founder', image: 'https://ui-avatars.com/api/?name=Jamie+Chen&background=7c3aed&color=fff&size=120' },
  { name: 'Taylor Smith', role: 'Head of Operations', image: 'https://ui-avatars.com/api/?name=Taylor+Smith&background=2563eb&color=fff&size=120' },
  { name: 'Jordan Lee', role: 'Head of Community', image: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=0891b2&color=fff&size=120' },
];

// Services Page Data
const categories = ['All', 'Plumbing', 'Cleaning', 'Electrical', 'HVAC', 'Moving', 'Painting', 'Other'];

const services = [
  { id: 1, name: 'Plumbing Services', category: 'Plumbing', icon: WrenchScrewdriverIcon, providers: 234, rating: 4.8, description: 'Expert plumbing services for residential and commercial properties.' },
  { id: 2, name: 'Deep Cleaning', category: 'Cleaning', icon: SparklesIcon, providers: 189, rating: 4.9, description: 'Professional deep cleaning for homes and offices with eco-friendly products.' },
  { id: 3, name: 'Electrical Work', category: 'Electrical', icon: BuildingOfficeIcon, providers: 156, rating: 4.7, description: 'Licensed electricians for repairs, installations, and inspections.' },
  { id: 4, name: 'HVAC Services', category: 'HVAC', icon: HomeModernIcon, providers: 123, rating: 4.8, description: 'Heating, ventilation, and air conditioning services for all seasons.' },
  { id: 5, name: 'Moving Services', category: 'Moving', icon: TruckIcon, providers: 98, rating: 4.6, description: 'Reliable local and long-distance moving services for homes and offices.' },
  { id: 6, name: 'Painting Services', category: 'Painting', icon: PaintBrushIcon, providers: 145, rating: 4.7, description: 'Interior and exterior painting services for residential and commercial spaces.' },
  { id: 7, name: 'Landscaping', category: 'Other', icon: ScissorsIcon, providers: 87, rating: 4.5, description: 'Professional landscaping and garden maintenance services.' },
  { id: 8, name: 'Smart Home Setup', category: 'Other', icon: CpuChipIcon, providers: 76, rating: 4.8, description: 'Smart home installation and automation services for modern living.' },
];

// Contact Page Data
const contactInfo = [
  { icon: EnvelopeIcon, label: 'Email', value: 'support@mavero.com', color: 'from-blue-500 to-blue-600' },
  { icon: PhoneIcon, label: 'Phone', value: '+1 (555) 123-4567', color: 'from-purple-500 to-purple-600' },
  { icon: MapPinIcon, label: 'Location', value: 'San Francisco, CA', color: 'from-teal-500 to-teal-600' },
  { icon: ClockIcon, label: 'Hours', value: 'Mon-Fri 9AM - 6PM PST', color: 'from-orange-500 to-orange-600' },
];

// ---------- Component ----------
const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${selectedCategory}` : ''}`);
    }
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const filteredServices = selectedServiceCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedServiceCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} logoSrc={logo} />

      {/* ===== HERO with Premium Background ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-0"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-3xl opacity-10 animate-pulse delay-500" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/10"
              >
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Trusted by 50,000+ users</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
                Find Trusted Local
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
                  Service Providers
                </span>
              </h1>

              <p className="text-xl text-blue-100/90 mb-8 max-w-lg leading-relaxed">
                Connect with vetted professionals. Pay securely with escrow.
                Get your job done right, every time.
              </p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch}
                className="relative mb-8"
              >
                <div className={`flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                  isSearchFocused ? 'ring-4 ring-blue-400/50 scale-[1.02] shadow-blue-500/20' : ''
                }`}>
                  <div className="flex-1 flex items-center px-4">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder="What service do you need?"
                      className="w-full px-3 py-4 text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="m-1.5 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    Search
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {serviceCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.name
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-8 text-sm text-blue-100/90"
              >
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-5 h-5 text-green-400" />
                  <span>Vetted providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <WalletIcon className="w-5 h-5 text-yellow-400" />
                  <span>Secure escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span>98% satisfaction</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-white rounded-2xl p-6 shadow-2xl"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">John's Plumbing</h3>
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-900">4.9</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">✓ Verified</span>
                            <span className="text-xs text-gray-500">• 2.3 miles away</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Emergency plumbing service available</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-gray-900">$85</span>
                            <motion.button 
                              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Book Now
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-white">$1.2M</div>
                        <div className="text-sm text-blue-100">in escrow held</div>
                      </motion.div>
                      <motion.div 
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-white">2,450</div>
                        <div className="text-sm text-blue-100">jobs done today</div>
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Average response: 5 mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>100% secure</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Top Rated</div>
                      <div className="text-xs text-gray-500">4.9 ★ average</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <WalletIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Secure Payment</div>
                      <div className="text-xs text-gray-500">Escrow protected</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-light tracking-wider">Scroll to explore</span>
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Mavero?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We make it easy and safe to find and hire trusted local service providers.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheckIcon, title: 'Vetted Professionals', description: 'Every provider is verified with ID, license, insurance, and background checks.' },
              { icon: MapPinIcon, title: 'Location-Based Matching', description: 'Find trusted service providers in your area with our intelligent matching system.' },
              { icon: WalletIcon, title: 'Secure Escrow Payments', description: 'Your funds are held securely and only released when you confirm completion.' },
              { icon: ChatBubbleLeftRightIcon, title: 'In-App Messaging', description: 'Communicate directly with providers and keep evidence for dispute resolution.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From finding the right professional to completing the job – we've got you covered.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gray-50 hover:bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition">
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <p className="text-sm text-gray-400 mt-2">{step.details}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20"
            >
              <GlobeAltIcon className="w-5 h-5" />
              <span className="text-sm font-medium">About Mavero</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Building Trust in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Local Services
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize how people find and hire trusted local service providers, making it safer, easier, and more transparent than ever before.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To create a world where finding a trusted service provider is as easy as ordering a ride. We believe in empowering local professionals and giving consumers the confidence they deserve.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through technology, transparency, and a commitment to excellence, we're building the future of local services.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: '50,000+', label: 'Active Users' },
                { number: '10,000+', label: 'Trusted Providers' },
                { number: '100,000+', label: 'Jobs Completed' },
                { number: '98%', label: 'Satisfaction Rate' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The principles that guide everything we do at Mavero.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The passionate people behind Mavero, dedicated to making local services better for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative inline-block">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-teal-600 via-blue-600 to-indigo-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20"
            >
              <BriefcaseIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Our Services</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Find the Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Service for You
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Browse our wide range of professional services, all provided by verified and trusted local experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedServiceCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    selectedServiceCategory === category
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{service.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{service.providers} providers</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{service.category}</span>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full">✓ Verified</span>
                </div>
                <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
                  View Providers
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Every service on Mavero comes with our guarantee of quality and trust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheckIcon, title: 'Fully Verified', description: 'Every provider is thoroughly vetted and verified.' },
              { icon: StarIcon, title: 'Top Rated', description: 'Only the highest-rated professionals make the cut.' },
              { icon: ClockIcon, title: 'Timely Service', description: 'Punctual and reliable service you can count on.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services CTA */}
      <section className="relative py-20 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Provider?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your search today and connect with trusted local professionals.
            </p>
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1">
              Start Searching
              <CheckBadgeIcon className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      {/* Hero Section */}
      {/* <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Let's Start a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Conversation
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or ideas? We'd love to hear from you. Reach out and we'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>✓ Message Sent!</>
                  ) : (
                    <>
                      Send Message
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're here to help! Reach out through any of these channels and we'll respond promptly.
                </p>
                
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className="font-medium text-gray-800">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-white rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <CheckBadgeIcon className="w-6 h-6 text-green-500" />
                    <div>
                      <div className="font-semibold text-gray-800">Response Time</div>
                      <div className="text-sm text-gray-500">Usually within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Quick answers to common questions about Mavero.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'Is Mavero free to use?', a: 'Yes! Creating an account and browsing services is completely free.' },
              { q: 'How are providers verified?', a: 'We verify each provider with ID, license, insurance, and background checks.' },
              { q: 'What is escrow payment?', a: 'Your payment is held securely and only released when you confirm the job is complete.' },
              { q: 'Can I cancel a booking?', a: 'Yes, you can cancel up to 24 hours before the scheduled service for a full refund.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Real experiences from real people who found their perfect service providers.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full ring-4 ring-blue-100"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg italic leading-relaxed">"{testimonials[activeTestimonial].content}"</p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-blue-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users finding trusted service providers every day.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1 text-lg"
            >
              Create Your Account
              <ArrowRightIcon className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;