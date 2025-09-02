// src/app/api/orders/[id]/status/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface Params {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();
  const { status, eta } = body;

  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status, estimated_time: eta ?? null })
    .eq("id", id)
    .select("id, status, estimated_time")
    .single();

  if (error) {
    console.error(`[PATCH /api/orders/${id}/status] error:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
