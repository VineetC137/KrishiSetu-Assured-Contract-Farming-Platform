'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateContractPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    price: '',
    deliveryDate: '',
    terms: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/contracts/create', {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });

      toast.success('Contract created successfully!');
      router.push('/farmer/contracts');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create contract';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout title="Create Contract">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Contract</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cropType" className="label">
                Crop Type
              </label>
              <select
                id="cropType"
                name="cropType"
                required
                className="input-field"
                value={formData.cropType}
                onChange={handleChange}
              >
                <option value="">Select crop type</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Corn">Corn</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Onion">Onion</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity" className="label">
                  Quantity (kg)
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  className="input-field"
                  placeholder="Enter quantity in kg"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="price" className="label">
                  Price per kg (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  className="input-field"
                  placeholder="Enter price per kg"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="deliveryDate" className="label">
                Expected Delivery Date
              </label>
              <input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="terms" className="label">
                Additional Terms & Conditions (Optional)
              </label>
              <textarea
                id="terms"
                name="terms"
                rows={4}
                className="input-field"
                placeholder="Enter any specific terms or conditions for this contract"
                value={formData.terms}
                onChange={handleChange}
              />
            </div>

            {/* Contract Summary */}
            {formData.quantity && formData.price && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-primary-800 mb-2">Contract Summary</h3>
                <div className="text-sm text-primary-700">
                  <p>Total Value: ₹{(Number(formData.quantity) * Number(formData.price)).toLocaleString()}</p>
                  <p>Crop: {formData.cropType}</p>
                  <p>Quantity: {formData.quantity} kg</p>
                  <p>Rate: ₹{formData.price} per kg</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}