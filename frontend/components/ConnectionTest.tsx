'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection...');
        const response = await api.get('/health');
        console.log('Health check response:', response.data);
        setStatus('success');
        setMessage('✅ Backend connection successful!');
      } catch (error: any) {
        console.error('Connection test failed:', error);
        setStatus('error');
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          setMessage('❌ Cannot connect to backend server. Please ensure the backend is running on port 5000.');
        } else {
          setMessage(`❌ Connection failed: ${error.message}`);
        }
      }
    };

    // Test connection after a short delay
    const timer = setTimeout(testConnection, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'testing') {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 text-sm">{message}</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 shadow-lg max-w-sm">
        <div className="text-red-800 text-sm">{message}</div>
        <div className="mt-2 text-xs text-red-600">
          Make sure to run: npm start in the backend folder
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3 shadow-lg">
      <div className="text-green-800 text-sm">{message}</div>
    </div>
  );
}