// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, table_id, status, total_amount, created_at, estimated_time")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[GET /api/orders] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
