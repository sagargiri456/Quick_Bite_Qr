import { supabase } from '@/lib/supabase/client';
import { MenuItem } from '@/types/menu';

// Define the type for creating a new menu item (omit id + timestamps)
export type NewMenuItem = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;

// READ: Fetches menu items (RLS filters to current restaurant automatically)
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

// CREATE: Adds a new menu item
export const addMenuItem = async (itemData: NewMenuItem): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([itemData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MenuItem;
};

// UPDATE: Updates an existing menu item
export const updateMenuItem = async (
  id: number,
  updates: Partial<MenuItem>
): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MenuItem;
};

// DELETE: Deletes a menu item
export const deleteMenuItem = async (id: number): Promise<void> => {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
