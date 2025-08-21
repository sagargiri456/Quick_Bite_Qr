// import { supabase } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabase/client';
import { MenuItem } from '@/types/menu';

// This defines the type for creating a new menu item.
// It omits 'id' because the database will generate it.
type NewMenuItem = Omit<MenuItem, 'id'>;

/**
 * Fetches all menu items from the database.
 */
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items') // IMPORTANT: Replace with your table name
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Could not fetch menu items.');
  }

  return data || [];
};

/**
 * Adds a new menu item (with an image URL) to the database.
 */
export const addMenuItem = async (newItemData: NewMenuItem): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([newItemData])
    .select()
    .single(); // .single() returns one object instead of an array

  if (error) {
    console.error('Error adding menu item:', error);
    throw new Error('Could not add menu item.');
  }

  return data;
};

/**
 * Updates an existing menu item in the database.
 */
export const updateMenuItem = async (id: number, updatedItemData: Partial<MenuItem>): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updatedItemData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Could not update menu item.');
  }

  return data;
};

/**
 * Deletes a menu item from the database.
 */
export const deleteMenuItem = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Could not delete menu item.');
  }
};