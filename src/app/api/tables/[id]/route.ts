import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// Helper function to verify ownership
async function verifyOwnership(supabase: any, tableId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if(!restaurant) return false;

  const { data: table, error } = await supabase
    .from("tables")
    .select("restaurant_id")
    .eq("id", tableId)
    .single();

  if (error || !table) return false;

  return table.restaurant_id === restaurant.id;
}


// GET single table details
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient(); // FIXED: Removed await

  const { data, error } = await (await supabase)
    .from("tables")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Table not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT update table info
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient(); // FIXED: Removed await

  const isOwner = await verifyOwnership(supabase, params.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { table_number } = body;

  const { data, error } = await (await supabase)
    .from("tables")
    .update({ table_number })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE single table
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient(); // FIXED: Removed await

  const isOwner = await verifyOwnership(supabase, params.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error } = await (await supabase).from("tables").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}