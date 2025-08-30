import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createServerClient } from '@/lib/supabase/server';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * POST body: { orderId, title, body, url? }
 * Sends to all subscriptions bound to the order
 */
export async function POST(req: Request) {
  try {
    const { orderId, title, body, url } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const supabase = await createServerClient();
    const { data: subs, error } = await supabase
      .from('web_push_subscriptions')
      .select('*')
      .eq('order_id', orderId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const payload = JSON.stringify({ title: title || 'Order update', body: body || '', data: { url } });

    const results = await Promise.allSettled(
      (subs || []).map(async (s) => {
        const subscription = {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth }
        } as any;
        try {
          await webpush.sendNotification(subscription, payload);
          return { ok: true };
        } catch (err: any) {
          // If gone, consider deleting the subscription
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await supabase.from('web_push_subscriptions').delete().eq('endpoint', s.endpoint);
          }
          return { ok: false, error: err?.message };
        }
      })
    );

    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
