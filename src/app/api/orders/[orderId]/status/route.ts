// src/app/api/orders/[orderId]/status/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const CLIENT_TO_DB_STATUS: Record<string, string> = {
  Pending: "pending",
  Confirmed: "confirmed",
  Preparing: "preparing",
  Ready: "ready",
  Complete: "complete",
  Cancelled: "cancelled",

  // if some clients already send lowercase, accept them as-is
  pending: "pending",
  confirmed: "confirmed",
  preparing: "preparing",
  ready: "ready",
  complete: "complete",
  cancelled: "cancelled",
};

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId?: string }> }
) {
  try {
    const p = params ? await params : {};
    const orderId = p?.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { status: incomingStatus, etaMinutes } = body ?? {};

    if (!incomingStatus && typeof etaMinutes === "undefined") {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Authenticate user (use getUser() to ensure server-side auth validation)
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error("supabase.auth.getUser error:", userErr);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    const user = userData?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: "Authentication required to update order status." }, { status: 401 });
    }

    // Fetch order and owning restaurant
    const { data: orderRow, error: orderFetchErr } = await supabase
      .from("orders")
      .select("id, restaurant_id, status")
      .eq("id", orderId)
      .single();

    if (orderFetchErr || !orderRow) {
      console.error("Order not found:", orderFetchErr);
      return NextResponse.json({ error: "Order not found or you do not have permission to modify it." }, { status: 404 });
    }

    // Verify restaurant ownership (adjust if your schema differs)
    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .select("id, user_id")
      .eq("id", orderRow.restaurant_id)
      .single();

    if (restErr || !restaurant) {
      console.error("Restaurant lookup failed:", restErr);
      return NextResponse.json({ error: "Could not verify restaurant ownership." }, { status: 403 });
    }

    if (restaurant.user_id !== user.id) {
      return NextResponse.json({ error: "Order not found or you do not have permission to modify it." }, { status: 403 });
    }

    // Map incoming status to DB enum value (lowercase)
    const updatePayload: { status?: string; estimated_time?: number | null } = {};
    if (incomingStatus) {
      const mapped = CLIENT_TO_DB_STATUS[incomingStatus];
      if (!mapped) {
        return NextResponse.json({ error: `Unknown status value: ${incomingStatus}` }, { status: 400 });
      }
      updatePayload.status = mapped;
    }

    if (typeof etaMinutes !== "undefined") {
      updatePayload.estimated_time = Number(etaMinutes) || null;
    }

    const { error: updateErr } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId);

    if (updateErr) {
      console.error("Failed to update order:", updateErr);
      return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
    }

    // Optionally insert an order_status_events row
    await supabase.from("order_status_events").insert({
      order_id: orderId,
      status: updatePayload.status ?? orderRow.status,
      note: "Updated via dashboard",
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Order status route error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
