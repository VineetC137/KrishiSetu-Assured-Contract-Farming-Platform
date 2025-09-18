'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function BuyerCreateContractPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: 'crops' as 'crops' | 'livestock' | 'poultry' | 'dairy',
    cropType: 'Rice',
    variety: '',
    quantity: '',
    unit: 'kg',
    price: '',
    deliveryDate: '',
    deliveryLocation: {
      address: '',
      city: '',
      state: 'Maharashtra',
      pincode: ''
    },
    terms: '',
    qualityParameters: {
      specifications: '',
      gradingCriteria: ''
    },
    equipmentSupport: {
      required: false,
      items: [] as string[],
      details: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEquipmentItemChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipmentSupport: {
        ...prev.equipmentSupport,
        items: checked
          ? [...prev.equipmentSupport.items, item]
          : prev.equipmentSupport.items.filter(i => i !== item)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting buyer contract proposal:', formData);
      
      const contractData = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        proposedBy: 'buyer' // Explicitly set this
      };

      console.log('Contract data being sent:', contractData);

      const response = await api.post('/contracts/create', contractData);
      
      console.log('Contract creation response:', response.data);
      toast.success('Contract proposal created successfully!');
      router.push('/buyer/contracts');
    } catch (error: any) {
      console.error('Create contract error:', error);
      const message = error.response?.data?.message || 'Failed to create contract proposal';
      toast.error(message);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getCropOptions = () => {
    const options: Record<string, string[]> = {
      crops: ['Rice', 'Wheat', 'Corn', 'Barley', 'Tomato', 'Potato', 'Onion'],
      livestock: ['Cow', 'Buffalo', 'Goat', 'Sheep'],
      poultry: ['Chicken', 'Duck', 'Turkey'],
      dairy: ['Milk', 'Cheese', 'Butter', 'Yogurt']
    };

    return options[formData.category] || [];
  };

  return (
    <Layout title="Create Contract Proposal">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card">
          <div className="mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">Create Contract Proposal</h1>
            <p className="text-gray-600">As a buyer, propose a contract to farmers with your requirements</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="label">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="crops">Crops</option>
                    <option value="livestock">Livestock</option>
                    <option value="poultry">Poultry</option>
                    <option value="dairy">Dairy</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cropType" className="label">Product Type</label>
                  <select
                    id="cropType"
                    name="cropType"
                    required
                    className="input-field"
                    value={formData.cropType}
                    onChange={handleChange}
                  >
                    {getCropOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quantity and Pricing */}
            <div className="floating-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quantity & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="quantity" className="label">
                    Required Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    className="input-field"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="unit" className="label">
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    required
                    className="input-field"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                    <option value="pieces">Pieces</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="label">
                    Offered Price per {formData.unit} (₹)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    className="input-field"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="floating-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚚 Delivery Requirements</h3>
              <div className="mb-4">
                <label htmlFor="deliveryDate" className="label">
                  Required Delivery Date
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="deliveryLocation.address" className="label">
                    Delivery Address
                  </label>
                  <input
                    id="deliveryLocation.address"
                    name="deliveryLocation.address"
                    type="text"
                    className="input-field"
                    placeholder="Enter delivery address"
                    value={formData.deliveryLocation.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="deliveryLocation.city" className="label">
                    City
                  </label>
                  <input
                    id="deliveryLocation.city"
                    name="deliveryLocation.city"
                    type="text"
                    className="input-field"
                    placeholder="Enter city"
                    value={formData.deliveryLocation.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="deliveryLocation.pincode" className="label">
                    Pincode
                  </label>
                  <input
                    id="deliveryLocation.pincode"
                    name="deliveryLocation.pincode"
                    type="text"
                    pattern="[0-9]{6}"
                    className="input-field"
                    placeholder="Enter pincode"
                    value={formData.deliveryLocation.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Quality Requirements */}
            <div className="floating-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Quality Requirements</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="qualityParameters.specifications" className="label">
                    Quality Specifications
                  </label>
                  <textarea
                    id="qualityParameters.specifications"
                    name="qualityParameters.specifications"
                    rows={2}
                    className="input-field"
                    placeholder="Describe quality requirements (e.g., organic, grade A, moisture content)"
                    value={formData.qualityParameters.specifications}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="qualityParameters.gradingCriteria" className="label">
                    Grading Criteria
                  </label>
                  <textarea
                    id="qualityParameters.gradingCriteria"
                    name="qualityParameters.gradingCriteria"
                    rows={2}
                    className="input-field"
                    placeholder="Specify grading standards and criteria"
                    value={formData.qualityParameters.gradingCriteria}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Equipment Support */}
            <div className="floating-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Equipment Support</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="equipmentSupport.required"
                    checked={formData.equipmentSupport.required}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      equipmentSupport: {
                        ...prev.equipmentSupport,
                        required: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I can provide equipment/input support for this contract
                  </span>
                </label>

                {formData.equipmentSupport.required && (
                  <div className="ml-6 space-y-3">
                    <p className="text-sm text-gray-600">Select items you can provide:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['seeds', 'fertilizers', 'pesticides', 'equipment', 'irrigation', 'other'].map((item) => (
                        <label key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.equipmentSupport.items.includes(item)}
                            onChange={(e) => handleEquipmentItemChange(item, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{item}</span>
                        </label>
                      ))}
                    </div>
                    <textarea
                      name="equipmentSupport.details"
                      rows={2}
                      className="input-field"
                      placeholder="Specify details about equipment/inputs you can provide"
                      value={formData.equipmentSupport.details}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="floating-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Terms & Conditions</h3>
              <textarea
                id="terms"
                name="terms"
                rows={4}
                className="input-field"
                placeholder="Enter any specific terms or conditions for this contract proposal"
                value={formData.terms}
                onChange={handleChange}
              />
            </div>

            {/* Contract Summary */}
            {formData.quantity && formData.price && (
              <div className="bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-2xl p-6 animate-bounce-in">
                <h3 className="text-xl font-bold text-blue-800 mb-3">💼 Contract Proposal Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-semibold">Total Value</p>
                    <p className="text-lg font-bold">₹{(Number(formData.quantity) * Number(formData.price)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Product</p>
                    <p>{formData.cropType} {formData.variety && `(${formData.variety})`}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Quantity</p>
                    <p>{formData.quantity} {formData.unit}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Rate</p>
                    <p>₹{formData.price} per {formData.unit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6">
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
                {isLoading ? 'Creating Proposal...' : '🚀 Create Contract Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}