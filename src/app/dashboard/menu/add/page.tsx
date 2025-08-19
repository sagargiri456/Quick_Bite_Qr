// src/app/dashboard/menu/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import { MenuCategory } from '@/types/menu';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { addMenuItem } = useMenuItems();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'starters' as MenuCategory,
    popular: false,
  });

  const categories: MenuCategory[] = ['starters', 'mains', 'desserts', 'drinks'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'price') {
      // Only allow numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const decimalCount = (numericValue.match(/\./g) || []).length;
      const sanitizedValue = decimalCount > 1 
        ? numericValue.substring(0, numericValue.lastIndexOf('.')) 
        : numericValue;
      
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Convert price to number
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addMenuItem({
        name: formData.name,
        description: formData.description,
        price: priceValue,
        category: formData.category,
        popular: formData.popular
      });
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      alert('Failed to add menu item. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Menu Item</h1>
              <p className="text-gray-700">Create a new item for your restaurant menu</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Name *
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all bg-white text-gray-900"
                  placeholder="e.g., Garlic Bread"
                />
              </div>

              {/* Description Field */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Description *
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all bg-white text-gray-900"
                  placeholder="Describe the menu item..."
                />
              </div>

              {/* Price Field */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    Price ($) *
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-700 font-medium">$</span>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all bg-white text-gray-900"
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17 10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v5zm-2-5a1 1 0 00-1-1H6a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V5z" clipRule="evenodd" />
                    </svg>
                    Category *
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all appearance-none bg-white text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Popular Checkbox */}
              <div className="md:col-span-2">
                <div className="flex items-center p-4 bg-amber-100 rounded-xl border-2 border-amber-200">
                  <input
                    type="checkbox"
                    id="popular"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleChange}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="popular" className="ml-3 flex items-center">
                    <span className="text-amber-900 font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Mark as popular item
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard/menu')}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Item
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-gray-700 text-sm">
          <p>Fields marked with * are required.</p>
        </div>
      </div>
    </div>
  );
}