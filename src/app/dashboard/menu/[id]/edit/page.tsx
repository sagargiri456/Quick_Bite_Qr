'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import MenuItemForm from '@/components/menu/MenuItemForm';
import { Loader2 } from 'lucide-react';
import { MenuItem } from '@/types/menu';

export default function EditMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  // 1. Get the loading state from the hook
  const { menuItems, updateMenuItem, loading: menuItemsLoading } = useMenuItems();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const itemId = parseInt(params.id as string);

  // 2. This effect now waits for the data to finish loading
  useEffect(() => {
    // Only proceed if the main loading is done and we have items
    if (!menuItemsLoading && menuItems.length > 0) {
      const itemToEdit = menuItems.find(item => item.id === itemId);
      if (itemToEdit) {
        setMenuItem(itemToEdit);
      }
      // We are done with the page's initial load
      setIsPageLoading(false);
    } 
    // Handle the case where loading finishes but there are no items
    else if (!menuItemsLoading) {
      setIsPageLoading(false);
    }
  }, [menuItems, itemId, menuItemsLoading]); // Added menuItemsLoading as a dependency

  const handleSubmit = async (data: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at'>) => {
    if (!menuItem) return;

    setIsSubmitting(true);
    try {
      await updateMenuItem(menuItem.id, data);
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      setIsSubmitting(false);
    }
  };

  // 3. Show a loading spinner while the page is figuring things out
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  // 4. This "not found" message will now only show after everything has loaded
  if (!menuItem) {
    return <div className="p-8 text-center text-xl text-gray-700">Menu item not found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors mr-4"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Menu Item</h1>
              <p className="text-gray-700">Update the details for this menu item.</p>
            </div>
        </div>

        <MenuItemForm
          initialData={menuItem}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.push('/dashboard/menu')}
        />
      </div>
    </div>
  );
}
