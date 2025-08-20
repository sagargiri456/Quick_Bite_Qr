// src/app/dashboard/menu/[id]/edit/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import MenuItemForm from '@/components/menu/MenuItemForm';

export default function EditMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const { menuItems, updateMenuItem } = useMenuItems();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemId = parseInt(params.id as string);
  const menuItem = menuItems.find(item => item.id === itemId);

  if (!menuItem) {
    return <div className="p-8">Menu item not found.</div>;
  }

  // CHANGED: handleSubmit preserves original category and popular status
  const handleSubmit = async (data: { name: string; description: string; price: number }) => {
    setIsSubmitting(true);
    try {
      // Combine original data with new form data to preserve fields not in the form
      const updatedItemData = {
        ...menuItem,
        ...data,
      };
      await updateMenuItem(itemId, updatedItemData);
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>
      <MenuItemForm
        initialData={menuItem}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push('/dashboard/menu')}
      />
    </div>
  );
}