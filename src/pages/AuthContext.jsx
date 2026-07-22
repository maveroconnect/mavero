// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api'; // will be created below

// ----------------------------
// INITIAL STATE
// ----------------------------

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: true,
  error: null,
};

// ----------------------------
// REDUCER
// ----------------------------

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

// ----------------------------
// CONTEXT
// ----------------------------

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch current user
        const response = await api.get('/auth/me');
        dispatch({ type: 'SET_USER', payload: response.data.user });
      } catch (error) {
        console.error('Auth loading error:', error);
        // Token invalid – clear it
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  // ----------------------------
  // AUTH METHODS
  // ----------------------------

  // Login
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });

      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });

      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user data
  const updateUser = (data) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  // Refresh user from server
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      console.error('Refresh user error:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const isProvider = state.user?.role === 'provider';
  const isClient = state.user?.role === 'client';
  const isAdmin = state.user?.role === 'admin';

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    hasRole,
    isProvider,
    isClient,
    isAdmin,
    isAuthenticated: !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ----------------------------
// HOOK
// ----------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;