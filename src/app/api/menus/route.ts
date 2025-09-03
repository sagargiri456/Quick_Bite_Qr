// src/app/api/menus/route.ts

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all menu items for the logged-in restaurant
export async function GET() {
  const supabase = createServerClient(); // FIXED: Removed await

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Find the restaurant for this user
  const { data: restaurant, error: restaurantError } = await (await supabase)
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: "Restaurant not found for this user" }, { status: 404 });
  }

  const { data, error } = await (await supabase)
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id) // Filter by restaurant_id
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}