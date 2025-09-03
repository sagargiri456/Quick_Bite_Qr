import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all orders for logged-in restaurant
export async function GET() {
  // FIXED: The call to createServerClient() must now be awaited.
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(name)), restaurants(restaurant_name), tables(table_number)")
    .eq("restaurant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST create a new order (public endpoint for customers)
export async function POST(req: Request) {
  // FIXED: The call must also be awaited here.
  const supabase = await createServerClient();
  const body = await req.json();
  
  const { restaurantId, tableId, totalAmount, cartItems } = body;

  if (!restaurantId || !tableId || !totalAmount || !Array.isArray(cartItems)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      restaurant_id: restaurantId,
      table_id: tableId,
      total_amount: totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (cartItems.length > 0) {
    const itemsPayload = cartItems.map((i: any) => ({
      order_id: order.id,
      menu_item_id: i.id,
      quantity: i.quantity,
      price: i.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
    if(itemsError) {
        await supabase.from('orders').delete().eq('id', order.id);
        return NextResponse.json({ error: `Could not save order items: ${itemsError.message}` }, { status: 500 });
    }
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('id', restaurantId)
    .single();

  return NextResponse.json({ 
    success: true, 
    trackCode: order.track_code, 
    restaurantSlug: restaurant?.slug 
  }, { status: 201 });
}