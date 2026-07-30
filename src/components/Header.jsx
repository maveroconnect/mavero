// src/components/Landing/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons from @heroicons/react
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  CreditCardIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// Logo - import your logo here if you have one
// If you don't have the image yet, comment this out
// import logo from '../../assets/image/logo.png';

const Header = ({ isScrolled = false, logoSrc = null }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
    setIsUserDropdownOpen(false);
  };

  // Logo component - uses logoSrc prop if provided, otherwise fallback to text
  const Logo = () => (
    <Link to="/" className="flex items-center space-x-2 group">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt="Mavero"
          className="h-10 w-auto object-contain"
        />
        
        
      ) : (
        <>
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
              <span className="text-white font-bold text-xl">M</span>
            </div>
          </motion.div>
          <span
            className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            Mavero
          </span>
          {!isScrolled && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs bg-blue-400/20 text-blue-100 px-2.5 py-0.5 rounded-full border border-white/10"
            >
              Beta
            </motion.span>
          )}
        </>
      )}
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3 border-b border-gray-100/50'
          : 'bg-transparent py-5'
      }`}
    >
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />
       

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`transition-colors duration-200 font-medium text-sm ${
                isScrolled
                  ? 'text-gray-600 hover:text-blue-600'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-colors duration-200 font-medium text-sm ${
                isScrolled
                  ? 'text-gray-600 hover:text-blue-600'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`transition-colors duration-200 font-medium text-sm ${
                isScrolled
                  ? 'text-gray-600 hover:text-blue-600'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Testimonials
            </button>

            
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isScrolled
                      ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
          
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
              isScrolled
                ? 'text-gray-900 hover:bg-gray-100'
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                Testimonials
              </button>
              <hr className="border-gray-200" />
            
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-2.5 text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
                  >
                    Get Started
                  </Link>
                </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;