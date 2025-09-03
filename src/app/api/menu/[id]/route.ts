import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { get } from "http";

// Helper function to verify ownership
async function verifyOwnership(supabase: any, menuItemId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: menuItem, error } = await supabase
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", menuItemId)
    .single();

  if (error || !menuItem) return false;

  // Assumes restaurant_id in menu_items is the same as the user's ID
  return menuItem.restaurant_id === user.id;
}


// GET one menu item (no auth needed for public viewing, but can be added if required)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

// UPDATE one menu item
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  
  // FIXED: Authorization check
  const isOwner = await verifyOwnership(supabase, params.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      available: body.available,
      photo_url: body.photo_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

// DELETE one menu item
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  // FIXED: Authorization check
  const isOwner = await verifyOwnership(supabase, params.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}