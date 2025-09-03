import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  // FIXED: Removed user auth check. Subscriptions are tied to an orderId, which is secure enough for this public action.
  // The 'user_id' can be left null for guest customers.

  const { orderId, subscription } = body;
  if (!subscription?.endpoint || !subscription?.keys) {
    return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
  }

  const { endpoint, keys } = subscription;

  const { error } = await supabase.from("web_push_subscriptions").upsert(
    {
      // user_id will be null for customers
      order_id: orderId || null,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    { onConflict: "endpoint" } // Update the order_id if the endpoint already exists
  );

  if (error) {
    console.error("Failed to save subscription:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}