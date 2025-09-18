'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface CropData {
  crops: {
    [key: string]: string[];
  };
  livestock: {
    [key: string]: string[];
  };
  poultry: {
    [key: string]: string[];
  };
  dairy: string[];
}

export default function CreateContractPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [formData, setFormData] = useState({
    category: 'crops',
    cropType: '',
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
    equipmentSupport: {
      required: false,
      items: [] as string[],
      details: ''
    },
    qualityParameters: {
      specifications: '',
      gradingCriteria: '',
      rejectionCriteria: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCropData();
  }, []);

  const fetchCropData = async () => {
    try {
      const response = await api.get('/data/crops');
      setCropData(response.data);
    } catch (error) {
      console.error('Error fetching crop data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/contracts/create', {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });

      toast.success(t.messages.contractCreated);
      router.push('/farmer/contracts');
    } catch (error: any) {
      const message = error.response?.data?.message || t.messages.operationFailed;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'deliveryLocation') {
        setFormData(prev => ({
          ...prev,
          deliveryLocation: {
            ...prev.deliveryLocation,
            [child]: value
          }
        }));
      } else if (parent === 'equipmentSupport') {
        setFormData(prev => ({
          ...prev,
          equipmentSupport: {
            ...prev.equipmentSupport,
            [child]: value
          }
        }));
      } else if (parent === 'qualityParameters') {
        setFormData(prev => ({
          ...prev,
          qualityParameters: {
            ...prev.qualityParameters,
            [child]: value
          }
        }));
      }
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'equipmentSupport.required') {
        setFormData(prev => ({
          ...prev,
          equipmentSupport: {
            ...prev.equipmentSupport,
            required: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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

  const getCropOptions = () => {
    if (!cropData) return [];

    switch (formData.category) {
      case 'crops':
        return Object.entries(cropData.crops).flatMap(([category, crops]) =>
          crops.map(crop => ({ value: crop, label: crop, category }))
        );
      case 'livestock':
        return Object.entries(cropData.livestock).flatMap(([category, animals]) =>
          animals.map(animal => ({ value: animal, label: animal, category }))
        );
      case 'poultry':
        return Object.entries(cropData.poultry).flatMap(([category, birds]) =>
          birds.map(bird => ({ value: bird, label: bird, category }))
        );
      case 'dairy':
        return cropData.dairy.map(item => ({ value: item, label: item, category: 'dairy' }));
      default:
        return [];
    }
  };

  return (
    <Layout title={t.contracts.createNew}>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.contracts.createNew}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
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

            {/* Crop/Product Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cropType" className="label">
                  {formData.category === 'crops' ? 'Crop Type' :
                    formData.category === 'livestock' ? 'Animal Type' :
                      formData.category === 'dairy' ? 'Product Type' : 'Product Type'}
                </label>
                <select
                  id="cropType"
                  name="cropType"
                  required
                  className="input-field"
                  value={formData.cropType}
                  onChange={handleChange}
                >
                  <option value="">Select {formData.category === 'crops' ? 'crop' : 'product'} type</option>
                  {getCropOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="variety" className="label">
                  Variety/Breed (Optional)
                </label>
                <input
                  id="variety"
                  name="variety"
                  type="text"
                  className="input-field"
                  placeholder="Enter variety or breed"
                  value={formData.variety}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="quantity" className="label">
                  Quantity
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
                  Price per {formData.unit} (₹)
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

            {/* Delivery Details */}
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

            {/* Delivery Location */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="deliveryLocation.address" className="label">
                    Address
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

            {/* Equipment Support */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Support</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="equipmentSupport.required"
                    checked={formData.equipmentSupport.required}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I need equipment/input support for this contract
                  </span>
                </label>

                {formData.equipmentSupport.required && (
                  <div className="ml-6 space-y-3">
                    <p className="text-sm text-gray-600">Select required items:</p>
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
                      placeholder="Specify details about required equipment/inputs"
                      value={formData.equipmentSupport.details}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quality Parameters */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Parameters</h3>
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

            {/* Terms */}
            <div>
              <label htmlFor="terms" className="label">
                Additional Terms & Conditions
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
                  <p>Product: {formData.cropType} {formData.variety && `(${formData.variety})`}</p>
                  <p>Quantity: {formData.quantity} {formData.unit}</p>
                  <p>Rate: ₹{formData.price} per {formData.unit}</p>
                  <p>Category: {formData.category}</p>
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