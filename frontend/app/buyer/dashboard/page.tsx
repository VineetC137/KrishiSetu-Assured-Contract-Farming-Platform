'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Link from 'next/link';
import api from '@/lib/axios';
import { Search, FileText, Clock, CheckCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contract {
  _id: string;
  cropType: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  status: string;
  farmerId: {
    username: string;
    email: string;
  };
  buyerId?: {
    username: string;
    email: string;
  };
  milestones: any[];
  paymentReleased: boolean;
  createdAt: string;
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    signed: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/my-contracts');
      const contractsData = response.data;
      
      const myContracts = contractsData.filter((c: Contract) => c.buyerId);
      const available = contractsData.filter((c: Contract) => !c.buyerId && c.status === 'Pending');
      
      setContracts(myContracts);
      setAvailableContracts(available);

      // Calculate stats
      const stats = myContracts.reduce((acc: any, contract: Contract) => {
        if (contract.status === 'Signed') acc.signed++;
        if (contract.status === 'In-progress') acc.inProgress++;
        if (contract.status === 'Completed') {
          acc.completed++;
          acc.totalSpent += contract.quantity * contract.price;
        }
        return acc;
      }, {
        signed: 0,
        inProgress: 0,
        completed: 0,
        totalSpent: 0,
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId: string) => {
    if (!confirm('Are you sure you want to purchase this contract? The contract amount will be deducted from your wallet.')) {
      return;
    }

    try {
      await api.post(`/contracts/sign/${contractId}`, {
        signatureData: 'digital_signature_placeholder' // Placeholder for now
      });
      toast.success('Contract purchased and signed successfully!');
      fetchContracts(); // Refresh data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to purchase contract';
      toast.error(message);
      console.error('Error signing contract:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Signed': return 'bg-blue-100 text-blue-800';
      case 'In-progress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout title="Buyer Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Buyer Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-blue-100">Discover and manage your farming contracts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Signed Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.signed}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Contracts */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Available Contracts</h2>
            <Link href="/buyer/contracts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {availableContracts.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No available contracts at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableContracts.slice(0, 6).map((contract) => (
                <div key={contract._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{contract.cropType}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Farmer: {contract.farmerId.username}</p>
                    <p>Quantity: {contract.quantity} kg</p>
                    <p>Price: ₹{contract.price}/kg</p>
                    <p className="font-semibold text-gray-900">
                      Total: ₹{(contract.quantity * contract.price).toLocaleString()}
                    </p>
                    <p>Delivery: {new Date(contract.deliveryDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/buyer/contracts/${contract._id}`}
                      className="flex-1 text-center btn-secondary text-sm py-2"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleSignContract(contract._id)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Buy & Sign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Contracts */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">My Contracts</h2>
            <Link href="/buyer/contracts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No signed contracts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farmer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.slice(0, 5).map((contract) => (
                    <tr key={contract._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contract.cropType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.farmerId.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{(contract.quantity * contract.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/buyer/contracts/${contract._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}