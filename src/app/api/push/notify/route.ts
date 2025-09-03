import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import webpush from "web-push";

// Load VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:admin@quickbiteqr.online",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: Request) {
  const supabase = await createServerClient();
  // FIXED: Check for an authenticated restaurant user before allowing notifications to be sent.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, title, message } = await req.json();

  // Get all subscriptions for this order
  const { data: subs, error } = await supabase
    .from("web_push_subscriptions")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    console.error("Error fetching subscriptions:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ success: false, message: "No subscribers for this order" });
  }

  const payload = JSON.stringify({
    title: title || "QuickBite QR",
    body: message || "New order update",
  });

  let successCount = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
        successCount++;
      } catch (err: any) {
        console.error("Push failed:", err?.message || err);
        // Cleanup dead subscription
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("web_push_subscriptions").delete().eq("id", sub.id);
        }
      }
    })
  );

  return NextResponse.json({ success: true, delivered: successCount });
}