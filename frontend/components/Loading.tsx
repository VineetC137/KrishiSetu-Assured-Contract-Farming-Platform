'use client';

import { Sprout } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  const containerClass = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="relative">
          <Sprout className="h-12 w-12 text-primary-600 mx-auto animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}