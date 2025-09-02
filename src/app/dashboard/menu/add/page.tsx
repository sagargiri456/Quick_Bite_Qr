// src/app/dashboard/menu/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import { useMyRestaurant } from '@/lib/hooks/useMyRestaurant';
import MenuItemForm from '@/components/menu/MenuItemForm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { MenuItem } from '@/types/menu';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { addMenuItem } = useMenuItems();
  const { restaurant, loading: restaurantLoading } = useMyRestaurant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => {
    if (!restaurant) {
      toast.error("Cannot add item: Restaurant not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMenuItem(formData, restaurant.id);
      toast.success(`Item "${formData.name}" created successfully!`);
      router.push('/dashboard/menu_items');
    } catch (error: any) {
      toast.error(`Failed to create item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (restaurantLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Menu Item</h1>
      <MenuItemForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.back()}
      />
    </div>
  );
}