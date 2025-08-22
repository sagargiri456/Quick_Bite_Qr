import { createServerClient } from '@supabase/ssr';

export async function getRestaurantDetails(cookies: any) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching restaurant:', error.message);
    return null;
  }

  return restaurant;
}