import { supabase } from '@/lib/supabase/client';
import { MenuItem as MenuItemType } from '@/types/menu';

// Extend the base MenuItem type to include the required restaurant_id
export interface MenuItem extends MenuItemType {
  restaurant_id: string;
}

// Define the type for creating a new menu item
export type NewMenuItem = Omit<MenuItem, 'id'>;

// READ: Fetches menu items (will be automatically filtered by RLS)
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

// CREATE: Adds a new menu item to the database
export const addMenuItem = async (itemData: NewMenuItem): Promise<MenuItem> => {
  const { data, error } = await supabase.from('menu_items').insert([itemData]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// UPDATE: Updates an existing menu item
export const updateMenuItem = async (id: number, updates: Partial<MenuItem>): Promise<MenuItem> => {
    const { data, error } = await supabase.from('menu_items').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
};

// DELETE: Deletes a menu item
export const deleteMenuItem = async (id: number): Promise<void> => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
};
