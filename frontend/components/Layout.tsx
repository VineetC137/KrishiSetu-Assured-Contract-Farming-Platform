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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="glass-effect shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="bg-gradient-to-r from-primary-600 to-green-600 p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">KrishiSetu</h1>
              </Link>
              {title && (
                <div className="ml-6 pl-6 border-l border-gray-300">
                  <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Wallet Balance */}
              <div className="flex items-center bg-gradient-to-r from-primary-50 to-green-50 px-4 py-2 rounded-xl border border-primary-200 shadow-sm">
                <Wallet className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-bold text-primary-700">
                  ₹{user.walletBalance.toLocaleString()}
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {user.profile?.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profile.profileImage}`}
                      alt="Profile"
                      className="h-6 w-6 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-600 mr-2" />
                  )}
                  <span className="text-sm font-semibold text-gray-700">
                    {user.profile?.fullName || user.username}
                  </span>
                  <span className={`ml-2 text-xs px-3 py-1 rounded-full font-medium ${
                    user.role === 'farmer' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 border border-gray-200 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href={`/${user.role}/dashboard`}
              className="border-b-3 border-primary-500 text-primary-600 py-4 px-2 text-sm font-semibold bg-primary-50 rounded-t-lg"
            >
              📊 Dashboard
            </Link>
            <Link
              href={`/${user.role}/contracts`}
              className="border-b-3 border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300 py-4 px-2 text-sm font-semibold transition-all duration-200 hover:bg-primary-50 rounded-t-lg"
            >
              📋 Contracts
            </Link>
            <Link
              href={`/${user.role}/wallet`}
              className="border-b-3 border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300 py-4 px-2 text-sm font-semibold transition-all duration-200 hover:bg-primary-50 rounded-t-lg"
            >
              💰 Wallet
            </Link>
            <Link
              href="/profile"
              className="border-b-3 border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300 py-4 px-2 text-sm font-semibold transition-all duration-200 hover:bg-primary-50 rounded-t-lg"
            >
              👤 Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}