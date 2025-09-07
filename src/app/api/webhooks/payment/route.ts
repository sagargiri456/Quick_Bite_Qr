// src/app/api/webhooks/payment/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { CartItem } from "@/app/(customer-end-pages)/store/cartStore";

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const body = await req.json().catch(() => null);

    if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const { orderId, paymentStatus, provider_txn_id } = body;

    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    // fetch order current status and cart_data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, cart_data, is_prepaid')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Webhook: order not found', orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If already paid, return success (idempotency)
    if (order.status === 'paid' || order.is_prepaid) {
      return NextResponse.json({ success: true, message: "Order already marked paid." });
    }

    if (paymentStatus !== 'SUCCESS') {
      // mark failed/cancelled depending on provider payload
      await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId);
      // insert event
      await supabase.from('order_status_events').insert({
        order_id: orderId,
        status: 'failed',
        note: `Payment gateway reported failure: ${paymentStatus}`,
      });
      return NextResponse.json({ success: true, message: "Payment failure recorded." });
    }

    // If no cart_data or empty, still mark paid but warn
    const cartItems = (order.cart_data ?? []) as CartItem[];

    // Check if items already exist for this order
    const { data: existingItems, error: existingError } = await supabase
      .from('order_items')
      .select('id')
      .eq('order_id', orderId)
      .limit(1);

    if (existingError) {
      console.error('Webhook: failed checking existing items', existingError);
      // proceed, but log
    }

    if (!existingItems || existingItems.length === 0) {
      // insert order_items if we have cart data
      if (cartItems && cartItems.length > 0) {
        const itemsPayload = cartItems.map((item) => ({
          order_id: orderId,
          menu_item: item.id, // note: your order_items FK is "menu_item"
          quantity: item.quantity,
          price: item.price,
        }));
        const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
        if (itemsError) {
          console.error(`CRITICAL: Failed to save items for paid order ${orderId}`, itemsError);
          return NextResponse.json({ error: `Could not save order items: ${itemsError.message}` }, { status: 500 });
        }
      } else {
        console.warn('Webhook: no cart_items found on order, skipping items insert.');
      }
    } else {
      console.log('Webhook: order_items already exist, skipping insert.');
    }

    // update order to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        cart_data: null,
        is_prepaid: true
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Webhook: failed to update order status to paid', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // write a status event record for auditing
    await supabase.from('order_status_events').insert({
      order_id: orderId,
      status: 'paid',
      note: provider_txn_id ? `Provider TXN: ${provider_txn_id}` : 'Paid via UPI provider webhook'
    });

    return NextResponse.json({ success: true, message: 'Order confirmed successfully.' });
  } catch (err: unknown) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
