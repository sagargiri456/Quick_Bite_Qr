// src/app/dashboard/menu/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import MenuItemForm from '@/components/menu/MenuItemForm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { supabase } from '@/lib/supabase/client';

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { updateMenuItem } = useMenuItems();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id || Array.isArray(id)) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error("Could not find the menu item to edit.");
        router.push('/dashboard/menu_items');
      } else {
        setItem(data);
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, router]);

  const handleSubmit = async (formData: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      await updateMenuItem(Number(id), formData);
      toast.success(`Item "${formData.name}" updated successfully!`);
      router.push('/dashboard/menu_items');
    } catch (error: any) {
      toast.error(`Failed to update item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !item) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit: {item.name}</h1>
      <MenuItemForm
        initialData={item}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.back()}
      />
    </div>
  );
}