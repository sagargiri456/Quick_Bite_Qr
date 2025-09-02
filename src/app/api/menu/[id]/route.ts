// src/app/api/menu/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("menu_items")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("[API:PUT /menu/:id] Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API:PUT /menu/:id] Exception:", err);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from("menu_items").delete().eq("id", params.id);

    if (error) {
      console.error("[API:DELETE /menu/:id] Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API:DELETE /menu/:id] Exception:", err);
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
