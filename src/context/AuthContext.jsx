// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // --- MOCK MODE: Use this when backend is not ready ---
        if (token) {
          // Simulate a logged-in user without calling the backend
          const mockUser = {
            _id: 'mock123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1 (555) 000-0000',
            role: 'client', // or 'provider' or 'admin' to test different roles
            isVerified: true,
            providerProfile: {
              vettingStatus: 'approved',
              businessName: 'John\'s Services',
            },
          };
          setUser(mockUser);
        }
        // --- END MOCK ---
        
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Auth loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // --- MOCK LOGIN ---
      // Simulate successful login without backend
      const mockUser = {
        _id: 'mock123',
        firstName: email.split('@')[0] || 'John',
        lastName: 'Doe',
        email: email,
        phone: '+1 (555) 000-0000',
        role: 'client',
        isVerified: true,
      };
      
      localStorage.setItem('token', 'mock_token_123');
      setUser(mockUser);
      toast.success(`Welcome back, ${mockUser.firstName}!`);
      return mockUser;
      // --- END MOCK ---
      
      // Uncomment this when backend is ready:
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // setUser(user);
      // toast.success(`Welcome back, ${user.firstName}!`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // --- MOCK REGISTER ---
      const mockUser = {
        _id: 'mock_' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isVerified: true,
      };
      
      localStorage.setItem('token', 'mock_token_' + Date.now());
      setUser(mockUser);
      toast.success('Account created successfully!');
      return mockUser;
      // --- END MOCK ---
      
      // Uncomment when backend is ready:
      // const response = await api.post('/auth/register', userData);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // setUser(user);
      // toast.success('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const refreshUser = async () => {
    // Mock refresh - just keep the current user
    return user;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};