'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'farmer' | 'buyer';
  walletBalance: number;
  createdAt: string;
  profile?: {
    fullName?: string;
    phone?: string;
    address?: string;
    farmSize?: string;
    businessType?: string;
    state?: string;
    district?: string;
    pincode?: string;
    profileImage?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
  profile?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up authentication
  useEffect(() => {
    if (!mounted) return;
    
    const token = Cookies.get('token');
    if (token) {
      console.log('🔑 Token found and will be set in headers by axios interceptor');
    }
  }, [mounted]);

  // Check if user is logged in on mount
  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          console.log('Checking auth with token:', token);
          const response = await api.get('/auth/me');
          console.log('Auth check response:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    // Add a small delay to ensure the API is ready
    setTimeout(checkAuth, 100);
  }, [mounted]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user: userData } = response.data;

      Cookies.set('token', token, { expires: 7 });
      setUser(userData);
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      const { token, user: newUser } = response.data;

      Cookies.set('token', token, { expires: 7 });
      setUser(newUser);
      
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};