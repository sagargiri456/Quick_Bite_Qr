// src/app/api/orders/[id]/items/route.ts

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerClient(); // FIXED: Removed await

  // Authorization check to ensure the order belongs to the user or is public
  const { data: { user } } = await supabase.auth.getUser();
  if (user) { // If a dashboard user is logged in, verify ownership
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (restaurant) {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('id', params.id)
          .eq('restaurant_id', restaurant.id);
        
        // If the order does not belong to the restaurant, deny access.
        if (count === 0) {
            return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
        }
    }
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("*, menu_items(name, price)") // Joined query to get item details
    .eq("order_id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}