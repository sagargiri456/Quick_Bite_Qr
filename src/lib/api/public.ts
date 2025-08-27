import { supabase } from "@/lib/supabase/client";
import { MenuItem } from "@/types/menu";
import { Restaurant } from "@/types/restaurant";

/**
 * Fetch basic restaurant details by slug
 */
export async function getRestaurantBySlug(
  slug: string
): Promise<{ id: string; restaurant_name: string; slug: string } | null> {
  const { data, error } = await supabase
    .from("restaurants")
    // FIX: Select 'restaurant_name' to match your database schema
    .select("id, restaurant_name, slug")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching restaurant by slug:", error.message);
    return null;
  }

  return data;
}

/**
 * ADDED: A new function to get all details for the cart and page header.
 * This was missing and causing a runtime error.
 */
export async function getRestaurantDetails(slug: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*') // Select all details
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching full restaurant details:", error.message);
        return null;
    }
    return data;
}


/**
 * Fetch available menu items for a restaurant by slug
 */
export async function getPublicMenuItems(slug: string): Promise<MenuItem[]> {
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return [];

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("available", true);

  if (error) {
    console.error("Error fetching public menu items:", error.message);
    return [];
  }

  return data || [];
}