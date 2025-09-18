'use client';

import { useLanguage } from '@/contexts/LanguageContext';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  transactionId: string;
  createdAt: string;
  contractId: {
    cropType: string;
    quantity: number;
    price: number;
  };
}

export default function FarmerWalletPage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      updateUser({ walletBalance: response.data.balance });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(fundAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > 50000) {
      toast.error('Maximum funding limit is ₹50,000');
      return;
    }

    setIsFunding(true);
    try {
      const response = await api.post('/wallet/fund', { amount });
      updateUser({ walletBalance: response.data.newBalance });
      setFundAmount('');
      toast.success(`₹${amount.toLocaleString()} added to your wallet!`);
      fetchTransactions(); // Refresh transactions
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fund wallet';
      toast.error(message);
    } finally {
      setIsFunding(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Credit':
      case 'Release':
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'Debit':
      case 'Lock':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Credit':
      case 'Release':
        return 'text-green-600';
      case 'Debit':
      case 'Lock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Layout title="Wallet">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Wallet">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Wallet className="h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold">Wallet Balance</h1>
              </div>
              <p className="text-4xl font-bold">₹{user?.walletBalance.toLocaleString()}</p>
              <p className="text-primary-100 mt-2">Available for withdrawal</p>
            </div>
          </div>
        </div>

        {/* Fund Wallet */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Funds</h2>
          <form onSubmit={handleFundWallet} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="number"
                min="1"
                max="50000"
                className="input-field"
                placeholder="Enter amount (₹1 - ₹50,000)"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isFunding}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isFunding ? 'Adding...' : 'Add Funds'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-2">
            This is a demo wallet. In production, this would integrate with real payment gateways.
          </p>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.type)}
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.transactionId} • {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                      {transaction.contractId && (
                        <p className="text-xs text-gray-500">
                          {transaction.contractId.cropType} - {transaction.contractId.quantity}kg
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'Credit' || transaction.type === 'Release' ? '+' : '-'}
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}