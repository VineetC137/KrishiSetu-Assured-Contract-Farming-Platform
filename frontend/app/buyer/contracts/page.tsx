'use client';

import { useLanguage } from '@/contexts/LanguageContext';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Search, Eye, FileSignature, FileText } from 'lucide-react';

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

export default function BuyerContractsPage() {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'my-contracts'>('available');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/my-contracts');
      const contractsData = response.data;
      
      const myContracts = contractsData.filter((c: Contract) => c.buyerId);
      const available = contractsData.filter((c: Contract) => !c.buyerId && c.status === t.contracts.pending);
      
      setContracts(myContracts);
      setAvailableContracts(available);
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case t.contracts.pending: return 'bg-yellow-100 text-yellow-800';
      case t.contracts.signed: return 'bg-blue-100 text-blue-800';
      case 'In-progress': return 'bg-purple-100 text-purple-800';
      case t.contracts.completed: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAvailableContracts = availableContracts.filter(contract =>
    contract.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.farmerId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyContracts = contracts.filter(contract =>
    contract.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.farmerId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout title="Contracts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Contracts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <Link href="/buyer/contracts/create" className="btn-primary flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Create Proposal
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Contracts ({availableContracts.length})
            </button>
            <button
              onClick={() => setActiveTab('my-contracts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-contracts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Contracts ({contracts.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop type or farmer..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Available Contracts Tab */}
        {activeTab === 'available' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Contracts</h2>
            
            {filteredAvailableContracts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {availableContracts.length === 0 ? 'No available contracts at the moment' : 'No contracts match your search'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableContracts.map((contract) => (
                  <div key={contract._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{contract.cropType}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <p><span className="font-medium">Farmer:</span> {contract.farmerId.username}</p>
                      <p><span className="font-medium">Quantity:</span> {contract.quantity} kg</p>
                      <p><span className="font-medium">Price:</span> ₹{contract.price}/kg</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Total: ₹{(contract.quantity * contract.price).toLocaleString()}
                      </p>
                      <p><span className="font-medium">Delivery:</span> {new Date(contract.deliveryDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/buyer/contracts/${contract._id}`}
                        className="flex-1 text-center btn-secondary text-sm py-2 flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => handleSignContract(contract._id)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
                      >
                        <FileSignature className="h-4 w-4 mr-1" />
                        Buy & Sign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Contracts Tab */}
        {activeTab === 'my-contracts' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">My Contracts</h2>
            
            {filteredMyContracts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {contracts.length === 0 ? 'No signed contracts yet' : 'No contracts match your search'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crop Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Milestones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMyContracts.map((contract) => (
                      <tr key={contract._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {contract.cropType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contract.farmerId.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contract.quantity} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{(contract.quantity * contract.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contract.milestones.length} completed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/buyer/contracts/${contract._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}