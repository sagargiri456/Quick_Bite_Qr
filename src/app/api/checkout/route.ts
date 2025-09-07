import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const { restaurantId, tableNumber, totalAmount, cartItems } = await req.json();

    if (!restaurantId || !tableNumber || !totalAmount || !cartItems) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('upi_id, restaurant_name, slug')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !restaurant?.upi_id) {
      return NextResponse.json({ error: "This restaurant has not configured online payments." }, { status: 400 });
    }

    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .single();

    if (tableError || !table) {
      return NextResponse.json({ error: `Table "${tableNumber}" does not exist for this restaurant.` }, { status: 404 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: restaurantId,
        table_id: table.id,
        total_amount: totalAmount,
        status: "payment_pending",
        cart_data: cartItems,
      })
      .select('id, track_code')
      .single();

    if (orderError) {
      console.error("DATABASE INSERT ERROR:", JSON.stringify(orderError, null, 2));
      return NextResponse.json({ error: "Failed to create the order in the database. Check RLS Policies." }, { status: 500 });
    }

    // Build UPI link
    const upiLink = `upi://pay?pa=${restaurant.upi_id}&pn=${encodeURIComponent(restaurant.restaurant_name)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Order #${order.track_code}`)}`;

    // Call Supabase Edge Function to generate QR (service key required)
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!);
    const { data: qrData, error: qrError } = await supabaseAdmin.functions.invoke('generate-payment-qr', { body: { upiLink } });
    if (qrError) {
      console.error("Edge function QR error:", qrError);
      // Not fatal for user: continue but log
    }

    // Save upi_link and payment_qr_url on order (best-effort)
    try {
      await supabase.from('orders').update({
        upi_link: upiLink,
        payment_qr_url: qrData?.qrDataUrl ?? null,
      }).eq('id', order.id);
    } catch (e) {
      console.error("Failed to update order with upi_link/qr:", e);
    }

    // Return the upi link and qr to the client so it can open the UPI app immediately
    return NextResponse.json({
      success: true,
      orderId: order.id,
      restaurantSlug: restaurant.slug,
      trackCode: order.track_code,
      upiLink,
      paymentQrUrl: qrData?.qrDataUrl ?? null,
    });

  } catch (err: unknown) {
    console.error("Checkout API Final Catch Block:", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
