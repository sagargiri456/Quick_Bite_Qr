// src/app/api/orders/[id]/items/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const { id } = params;
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("order_items")
    .select("id, order_id, quantity, price, created_at, menu_item")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(`[GET /api/orders/${id}/items] error:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}