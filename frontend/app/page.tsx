'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Sprout, Users, FileText, Wallet } from 'lucide-react';
import Loading from '@/components/Loading';
import ConnectionTest from '@/components/ConnectionTest';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return <Loading message="Loading KrishiSetu..." fullScreen />;
  }

  if (user) {
    return <Loading message="Redirecting to dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50">
      {/* Header */}
      <header className="glass-effect shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center animate-fade-in">
              <div className="bg-gradient-to-r from-primary-600 to-green-600 p-2 rounded-xl mr-3">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">KrishiSetu</h1>
            </div>
            <div className="flex space-x-4 animate-slide-up">
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 animate-bounce-in">
              🌾 Revolutionizing Agriculture
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
            <span className="gradient-text">Assured Contract</span>
            <br />
            <span className="text-gray-800">Farming Platform</span>
          </h2>
          <p className="mt-8 text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Connect farmers with buyers through secure, transparent contract farming agreements. 
            Track milestones, manage payments, and build trust in agriculture with our comprehensive digital platform.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 animate-bounce-in">
            <Link href="/auth/register?role=farmer" className="btn-primary text-lg px-10 py-4 text-center">
              🚜 Join as Farmer
            </Link>
            <Link href="/auth/register?role=buyer" className="btn-secondary text-lg px-10 py-4 text-center">
              🏢 Join as Buyer
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="floating-card text-center group">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl mx-auto mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
            <p className="text-gray-600 leading-relaxed">Direct connection between farmers and buyers with real-time chat</p>
          </div>
          
          <div className="floating-card text-center group">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl mx-auto mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Contracts</h3>
            <p className="text-gray-600 leading-relaxed">Digital contracts with signatures and PDF generation</p>
          </div>
          
          <div className="floating-card text-center group">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl mx-auto mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Sprout className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">8-stage milestone tracking with photo proof</p>
          </div>
          
          <div className="floating-card text-center group">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl mx-auto mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Wallet className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600 leading-relaxed">Multiple payment methods with escrow protection</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Create Contract</h4>
              <p className="text-gray-600">Farmers create contracts specifying crop type, quantity, and delivery terms</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sign & Pay</h4>
              <p className="text-gray-600">Buyers review and sign contracts, with payment held in escrow</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Track & Deliver</h4>
              <p className="text-gray-600">Track progress through milestones and receive payment on completion</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 KrishiSetu. Empowering farmers through technology.</p>
          </div>
        </div>
      </footer>

      {/* Connection Test - Only show in development */}
      {process.env.NODE_ENV === 'development' && <ConnectionTest />}
    </div>
  );
}