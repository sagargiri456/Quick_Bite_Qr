'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import MenuItemForm from '@/components/menu/MenuItemForm';
import { getMyRestaurant } from '@/lib/api/restaurants';
import { Loader2 } from 'lucide-react';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { addMenuItem } = useMenuItems();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to hold the user's restaurant ID
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the restaurant ID when the page loads
  useEffect(() => {
    const loadRestaurant = async () => {
      const restaurant = await getMyRestaurant();
      if (restaurant) {
        setRestaurantId(restaurant.id);
      } else {
        console.error('No restaurant found for this user.');
        // You could redirect or show an error toast here.
      }
      setIsLoading(false);
    };
    loadRestaurant();
  }, []);

  // NOTE: photo_url matches DB; available will be defaulted here
  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    photo_url?: string;
    available?: boolean; // allow coming from form later if you add a checkbox
  }) => {
    if (!restaurantId) {
      alert('Error: Could not find your restaurant ID. Please try logging in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newItemData = {
        ...data,
        category: 'mains' as const, // Default category
        available: data.available ?? true, // <-- REQUIRED by NewMenuItem
      };

      // Pass both the form data and the fetched restaurantId to the hook
      await addMenuItem(newItemData, restaurantId);
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      // Optionally, show an error toast/message to the user on the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loading spinner while fetching the restaurant ID
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Menu Item</h1>
            <p className="text-gray-700">Create a new item for your restaurant menu.</p>
          </div>
        </div>

        <MenuItemForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.push('/dashboard/menu')}
        />
      </div>
    </div>
  );
}
