'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Sprout, Users, FileText, Wallet } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
    }
  }, [user, router]);

  if (user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">KrishiSetu</h1>
            </div>
            <div className="flex space-x-4">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Assured Contract Farming
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Connect farmers with buyers through secure, transparent contract farming agreements. 
            Track milestones, manage payments, and build trust in agriculture.
          </p>
          <div className="mt-10 flex justify-center space-x-6">
            <Link href="/auth/register?role=farmer" className="btn-primary text-lg px-8 py-3">
              Join as Farmer
            </Link>
            <Link href="/auth/register?role=buyer" className="btn-secondary text-lg px-8 py-3">
              Join as Buyer
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">Direct connection between farmers and buyers</p>
          </div>
          
          <div className="card text-center">
            <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contracts</h3>
            <p className="text-gray-600">Digital contracts with PDF generation</p>
          </div>
          
          <div className="card text-center">
            <Sprout className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track</h3>
            <p className="text-gray-600">Milestone tracking with photo updates</p>
          </div>
          
          <div className="card text-center">
            <Wallet className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
            <p className="text-gray-600">Secure payment system with escrow</p>
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
    </div>
  );
}