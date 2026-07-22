// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Landing/Header';
import Footer from '../components/Landing/Footer';
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
  UsersIcon,
  ChevronDownIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

// ---------- Data ----------
const serviceCategories = [
  { id: 1, name: 'Plumbing', icon: WrenchScrewdriverIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 2, name: 'Cleaning', icon: SparklesIcon, color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Electrical', icon: BuildingOfficeIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, name: 'Moving', icon: TruckIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 5, name: 'HVAC', icon: HomeModernIcon, color: 'bg-red-100 text-red-600' },
  { id: 6, name: 'Painting', icon: WrenchScrewdriverIcon, color: 'bg-pink-100 text-pink-600' },
];

// Expanded to 6 steps
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
  // ... (same as before)
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
  { number: '50,000+', label: 'Active Users', icon: UsersIcon },
  { number: '10,000+', label: 'Vetted Providers', icon: CheckBadgeIcon },
  { number: '100,000+', label: 'Jobs Completed', icon: BriefcaseIcon },
  { number: '98%', label: 'Satisfaction Rate', icon: StarIcon }
];

// ---------- Component ----------
const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} logoSrc={logo} />

      {/* ===== HERO ===== */}
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
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Trusted by 50,000+ users</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Find Trusted Local
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  Service Providers
                </span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Connect with vetted professionals. Pay securely with escrow.
                Get your job done right, every time.
              </p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch}
                className="relative mb-6"
              >
                <div className={`flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                  isSearchFocused ? 'ring-4 ring-blue-400/30 scale-[1.02]' : ''
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
                    className="m-1.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
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
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.name
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-6 text-sm text-blue-100"
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

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl">
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
                            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-2xl font-bold text-white">$1.2M</div>
                        <div className="text-sm text-blue-100">in escrow held</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-2xl font-bold text-white">2,450</div>
                        <div className="text-sm text-blue-100">jobs done today</div>
                      </div>
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

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll to explore</span>
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES (Why Choose Mavero?) with Gradient Background ===== */}
      <section id="features" className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Mavero?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-white/50"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (6 steps) ===== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">How It Works</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            From finding the right professional to completing the job – we've got you covered.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-50 hover:bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <p className="text-sm text-gray-400 mt-2">{step.details}</p>
                {/* Connector line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonials[activeTestimonial].name}</h4>
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
                  <p className="text-gray-700 text-lg italic">"{testimonials[activeTestimonial].content}"</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition ${index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users finding trusted service providers every day.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
          >
            Create Your Account
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;