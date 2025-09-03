import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerClient();
  
  // FIXED: Authorization check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count, error: checkError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('id', params.id)
    .eq('restaurant_id', user.id);
  
  if (checkError || count === 0) {
      return NextResponse.json({ error: "Order not found or you do not have permission to modify it." }, { status: 404 });
  }
  
  const body = await req.json();
  const { status, note, etaMinutes } = body;

  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  // Update order status
  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status,
      estimated_time: etaMinutes ?? null,
      status_updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insert status event
  await supabase.from("order_status_events").insert({
    order_id: params.id,
    status,
    note,
  });

  // Trigger push notification
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/push/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: params.id,
      title: `Order ${status}`,
      message: note || `Your order is now ${status}`,
    }),
  });

  return NextResponse.json(order);
}