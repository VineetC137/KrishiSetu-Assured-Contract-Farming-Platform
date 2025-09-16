'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, LogOut, User, Wallet } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Sprout className="h-8 w-8 text-primary-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">KrishiSetu</h1>
              </Link>
              {title && (
                <div className="ml-6 pl-6 border-l border-gray-300">
                  <h2 className="text-lg font-medium text-gray-700">{title}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Wallet Balance */}
              <div className="flex items-center bg-primary-50 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-700">
                  ₹{user.walletBalance.toLocaleString()}
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                  <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href={`/${user.role}/dashboard`}
              className="border-b-2 border-primary-500 text-primary-600 py-4 px-1 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href={`/${user.role}/contracts`}
              className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
            >
              Contracts
            </Link>
            <Link
              href={`/${user.role}/wallet`}
              className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
            >
              Wallet
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}