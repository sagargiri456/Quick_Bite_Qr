// src/app/api/menus/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // First, get the restaurant ID for the logged-in user
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: 'Restaurant not found for the current user' }, { status: 404 });
  }

  // Now, fetch the menus associated with that restaurant ID
  const { data, error } = await supabase
    .from('menus') // Assumes you have a 'menus' table
    .select('*')
    .eq('restaurant_id', restaurant.id);

  if (error) {
    console.error('Error fetching menus:', error.message);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }

  return NextResponse.json(data || []);
}