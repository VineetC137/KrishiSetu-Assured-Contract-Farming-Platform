'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, User, Package, DollarSign, FileText, CheckCircle, FileSignature } from 'lucide-react';

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
  milestones: Array<{
    _id: string;
    description: string;
    imageUrl?: string;
    isCompleted: boolean;
    completionDate: string;
  }>;
  paymentReleased: boolean;
  contractFile?: string;
  terms: string;
  createdAt: string;
}

export default function BuyerContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const fetchContract = async () => {
    try {
      const response = await axios.get(`/api/contracts/${params.id}`);
      setContract(response.data);
    } catch (error) {
      console.error('Error fetching contract:', error);
      toast.error('Failed to load contract');
      router.push('/buyer/contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    if (!confirm('Are you sure you want to sign this contract? The contract amount will be deducted from your wallet.')) {
      return;
    }

    try {
      await axios.post(`/api/contracts/sign/${params.id}`);
      toast.success('Contract signed successfully!');
      fetchContract(); // Refresh contract data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to sign contract';
      toast.error(message);
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
      <Layout title="Contract Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!contract) {
    return (
      <Layout title="Contract Details">
        <div className="text-center py-8">
          <p className="text-gray-500">Contract not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Contract Details">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Contract Header */}
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{contract.cropType} Contract</h1>
              <p className="text-gray-600">Contract ID: {contract._id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
              {contract.status === 'Pending' && !contract.buyerId && (
                <button
                  onClick={handleSignContract}
                  className="btn-primary flex items-center"
                >
                  <FileSignature className="h-4 w-4 mr-2" />
                  Sign Contract
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-semibold">{contract.quantity} kg</p>
              </div>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="font-semibold">₹{(contract.quantity * contract.price).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Delivery Date</p>
                <p className="font-semibold">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Farmer</p>
                <p className="font-semibold">{contract.farmerId.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Farmer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{contract.farmerId.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{contract.farmerId.email}</p>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        {contract.status !== 'Pending' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracking</h2>
            
            {contract.milestones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No milestones added yet</p>
                <p className="text-sm text-gray-400 mt-1">The farmer will add progress updates here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contract.milestones.map((milestone, index) => (
                  <div key={milestone._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium">Milestone {index + 1}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(milestone.completionDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{milestone.description}</p>
                      </div>
                      {milestone.imageUrl && (
                        <img
                          src={`http://localhost:5000${milestone.imageUrl}`}
                          alt="Milestone"
                          className="w-20 h-20 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment Status */}
        {contract.status !== 'Pending' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Contract Amount</p>
                <p className="text-sm text-gray-600">₹{(contract.quantity * contract.price).toLocaleString()}</p>
              </div>
              <div className="text-right">
                {contract.paymentReleased ? (
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Payment Released
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Funds transferred to farmer</p>
                  </div>
                ) : (
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Funds Locked
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Will be released on completion</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contract Terms */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{contract.terms}</p>
        </div>

        {/* Contract File */}
        {contract.contractFile && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Document</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Signed Contract</p>
                  <p className="text-sm text-gray-600">PDF Document</p>
                </div>
              </div>
              <a
                href={`http://localhost:5000${contract.contractFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}