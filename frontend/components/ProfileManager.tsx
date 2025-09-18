'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Camera, User, Phone, MapPin, Building, Briefcase } from 'lucide-react';

interface ProfileManagerProps {
  onClose?: () => void;
}

export default function ProfileManager({ onClose }: ProfileManagerProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.profile?.fullName || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    farmSize: user?.profile?.farmSize || '',
    businessType: user?.profile?.businessType || '',
    state: user?.profile?.state || 'Maharashtra',
    district: user?.profile?.district || '',
    pincode: user?.profile?.pincode || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      if (onClose) onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await api.post('/auth/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user profile with new image
      updateUser({
        ...user,
        profile: {
          ...user?.profile,
          profileImage: response.data.profileImage
        }
      });

      toast.success('Profile photo updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to upload photo';
      toast.error(message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Profile Settings</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.profile?.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profile.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <button
              onClick={triggerFileInput}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
            >
              {isUploadingPhoto ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">Click camera icon to upload photo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="label">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="input-field"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <label htmlFor="address" className="label">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="input-field"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="state" className="label">State</label>
              <select
                id="state"
                name="state"
                className="input-field"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div>
              <label htmlFor="district" className="label">District</label>
              <input
                id="district"
                name="district"
                type="text"
                className="input-field"
                placeholder="Enter district"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="pincode" className="label">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                pattern="[0-9]{6}"
                className="input-field"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role-specific fields */}
          {user?.role === 'farmer' && (
            <div>
              <label htmlFor="farmSize" className="label">
                <Building className="w-4 h-4 inline mr-2" />
                Farm Size (in acres)
              </label>
              <input
                id="farmSize"
                name="farmSize"
                type="text"
                className="input-field"
                placeholder="Enter farm size"
                value={formData.farmSize}
                onChange={handleChange}
              />
            </div>
          )}

          {user?.role === 'buyer' && (
            <div>
              <label htmlFor="businessType" className="label">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Business Type
              </label>
              <input
                id="businessType"
                name="businessType"
                type="text"
                className="input-field"
                placeholder="Enter business type (e.g., Retailer, Wholesaler, Processor)"
                value={formData.businessType}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}