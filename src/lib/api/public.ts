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
    .select("id, restaurant_name, slug")
    .eq("slug", slug)
    // FIX: Use .maybeSingle() to prevent errors if multiple rows are found
    .maybeSingle();

  if (error) {
    console.error("Error fetching restaurant by slug:", error.message);
    return null;
  }

  return data;
}

/**
 * Get all details for the cart and page header.
 */
export async function getRestaurantDetails(slug: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*') // Select all details
        .eq('slug', slug)
        // FIX: Use .maybeSingle() here as well for consistency and safety
        .maybeSingle();

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