import { supabase } from '@/lib/supabase/client';
import { MenuItem } from '@/types/menu';

export const getPublicMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('available', true);

  if (error) {
    console.error("Error fetching public menu items:", error);
    return [];
  }
  return data;
};

export const getRestaurantDetails = async (restaurantId: string): Promise<{ restaurant_name: string } | null> => {
    const { data, error } = await supabase
        .from('restaurants')
        .select('restaurant_name')
        .eq('id', restaurantId)
        .single();

    if (error) {
        console.error("Error fetching restaurant details:", error);
        return null;
    }
    return data;
};