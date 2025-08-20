// src/app/dashboard/menu/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import MenuItemForm from '@/components/menu/MenuItemForm';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { addMenuItem } = useMenuItems();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CHANGED: handleSubmit now adds default values for the removed fields
  const handleSubmit = async (data: { name: string; description: string; price: number }) => {
    setIsSubmitting(true);
    try {
      const newItemData = {
        ...data,
        category: 'mains' as const, // Default category
        popular: false,             // Default popular status
      };
      await addMenuItem(newItemData);
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Menu Item</h1>
              <p className="text-gray-700">Create a new item for your restaurant menu</p>
            </div>
          </div>
        </div>

        <MenuItemForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.push('/dashboard/menu')}
        />

        <div className="mt-6 text-center text-gray-700 text-sm">
          <p>Fields marked with * are required.</p>
        </div>
      </div>
    </div>
  );
}