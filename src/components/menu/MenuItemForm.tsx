'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import ImageUpload from './ImageUpload';

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSubmit: (data: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at'>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function MenuItemForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    photo_url: '',
    available: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: String(initialData.price),
        photo_url: initialData.photo_url || '',
        available: initialData.available ?? true,
      });
    }
  }, [initialData]);
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price) newErrors.price = 'Price is required.';
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Please enter a valid, positive price.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    if (name === 'price') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      const decimalCount = (numericValue.match(/\./g) || []).length;
      const sanitizedValue = decimalCount > 1 ? numericValue.substring(0, numericValue.lastIndexOf('.')) : numericValue;
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <label className="w-full text-lg font-semibold text-gray-800 mb-2">Item Image</label>
          <ImageUpload
            value={formData.photo_url}
            onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url || '' }))}
          />
        </div>
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-all"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-all"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-lg font-semibold text-gray-800 mb-2">Price (₹) *</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-all"
              placeholder="0.00"
              inputMode="decimal"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
            
        {/* Available Toggle */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
          <label htmlFor="available" className="text-lg font-semibold text-gray-800">Item Available</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
