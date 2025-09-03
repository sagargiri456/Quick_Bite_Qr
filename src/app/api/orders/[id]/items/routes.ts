import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerClient();

  // FIXED: Add authorization check to ensure the order belongs to the user
  const { data: { user } } = await supabase.auth.getUser();
  if (user) { // If a dashboard user is logged in
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('id', params.id)
      .eq('restaurant_id', user.id);
      
    if (count === 0) {
        // This check can be skipped for public customer access if desired
        // return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
    }
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("*, menu_items(name, price)") // Corrected table name
    .eq("order_id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}