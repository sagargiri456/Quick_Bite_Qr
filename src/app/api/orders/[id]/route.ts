import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerClient();
  const { status, note, etaMinutes } = await req.json();
  const orderId = params.id;

  // 1. Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status, estimated_time: etaMinutes, status_updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) {
    console.error("Order update failed:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 2. Insert into order_status_events
  await supabase.from("order_status_events").insert({
    order_id: orderId,
    status,
    note,
  });

  // 3. Send notification
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/push/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        title: `Order ${status}`,
        message: note || `Your order status changed to ${status}`,
      }),
    });
  } catch (err) {
    console.error("Failed to send push notification:", err);
  }

  return NextResponse.json({ success: true });
}
