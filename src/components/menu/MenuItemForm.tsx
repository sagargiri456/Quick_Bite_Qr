// src/components/menu/MenuItemForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import ImageUpload from './ImageUpload';

interface MenuItemFormProps {
  initialData?: Omit<MenuItem, 'id' | 'category' | 'popular'> & { imageUrl?: string | null };
  onSubmit: (data: { name: string; description: string; price: number; imageUrl?: string }) => void;
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
    imageUrl: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: String(initialData.price),
        imageUrl: initialData.imageUrl || '',
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
    const { name, value } = e.target;
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
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Item Image</label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">Name *</label>
          <input
            type="text" id="name" name="name"
            value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            placeholder="e.g., Spicy Pasta"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">Description *</label>
          <textarea
            id="description" name="description"
            value={formData.description} onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            placeholder="Describe the menu item..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">Price ($) *</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-700 font-medium">$</span>
            <input
              type="text" id="price" name="price"
              value={formData.price} onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0.00" inputMode="decimal"
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onCancel} className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
}