import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { orderId, subscription } = await req.json();
    if (!orderId || !subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const p256dh = subscription.keys?.p256dh;
    const auth = subscription.keys?.auth;

    const supabase = await createServerClient();
    // Upsert by endpoint to avoid duplicates
    const { error } = await supabase
      .from('web_push_subscriptions')
      .upsert({
        order_id: orderId,
        endpoint: subscription.endpoint,
        p256dh, auth
      }, { onConflict: 'endpoint' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
