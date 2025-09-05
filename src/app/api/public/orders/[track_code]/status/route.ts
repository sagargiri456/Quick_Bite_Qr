// src/app/api/public/orders/[track_code]/status/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params?: Record<string, any> | Promise<Record<string, any>> }) {
  try {
    const p = params ? (await params) : {};
    let code = p?.track_code || p?.trackCode || p?.code;

    if (!code) {
      const url = new URL(req.url);
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('orders');
      if (idx !== -1 && parts.length > idx + 1) code = parts[idx + 1];
    }

    if (!code) return NextResponse.json({ error: "Tracking code missing" }, { status: 400 });

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('track_code', code)
      .single();

    if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ status: data.status });
  } catch (err: any) {
    console.error("Status API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
