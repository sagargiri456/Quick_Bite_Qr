// src/app/api/public/orders/[track_code]/status/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: Promise<{ track_code: string }> }) {
  try {
    const { track_code: code } = await params;

    if (!code) return NextResponse.json({ error: "Tracking code missing" }, { status: 400 });

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('track_code', code)
      .single();

    if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ status: data.status });
  } catch (err: unknown) {
    console.error("Status API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
