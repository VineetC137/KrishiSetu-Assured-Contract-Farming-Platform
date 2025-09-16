'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, User, Package, DollarSign, FileText, Camera, CheckCircle } from 'lucide-react';

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

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [milestoneForm, setMilestoneForm] = useState({
    description: '',
    image: null as File | null,
  });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

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
      router.push('/farmer/contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.description.trim()) return;

    setIsAddingMilestone(true);
    const formData = new FormData();
    formData.append('description', milestoneForm.description);
    if (milestoneForm.image) {
      formData.append('image', milestoneForm.image);
    }

    try {
      await axios.post(`/api/contracts/milestone/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Milestone added successfully!');
      setMilestoneForm({ description: '', image: null });
      fetchContract(); // Refresh contract data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add milestone';
      toast.error(message);
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const handleCompleteContract = async () => {
    if (!confirm('Are you sure you want to mark this contract as completed? This will release the payment.')) {
      return;
    }

    try {
      await axios.post(`/api/contracts/complete/${params.id}`);
      toast.success('Contract completed and payment released!');
      fetchContract();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to complete contract';
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
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
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
                <p className="text-sm text-gray-600">Buyer</p>
                <p className="font-semibold">{contract.buyerId?.username || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        {contract.status !== 'Pending' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h2>
            
            {/* Existing Milestones */}
            {contract.milestones.length > 0 && (
              <div className="space-y-4 mb-6">
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

            {/* Add Milestone Form */}
            {(contract.status === 'Signed' || contract.status === 'In-progress') && (
              <form onSubmit={handleAddMilestone} className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Add New Milestone</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Description</label>
                    <textarea
                      required
                      rows={3}
                      className="input-field"
                      placeholder="Describe the current progress..."
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Photo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input-field"
                      onChange={(e) => setMilestoneForm(prev => ({ 
                        ...prev, 
                        image: e.target.files?.[0] || null 
                      }))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingMilestone}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingMilestone ? 'Adding...' : 'Add Milestone'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Actions */}
        {contract.status === 'In-progress' && contract.milestones.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <button
              onClick={handleCompleteContract}
              className="btn-primary"
            >
              Mark Contract as Completed
            </button>
            <p className="text-sm text-gray-600 mt-2">
              This will release the payment to your wallet.
            </p>
          </div>
        )}

        {/* Contract Terms */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{contract.terms}</p>
        </div>
      </div>
    </Layout>
  );
}