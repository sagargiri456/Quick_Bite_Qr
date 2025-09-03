import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        restaurant_id: body.restaurant_id ?? user.id, // fallback to user.id
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category ?? "mains",
        available: body.available ?? true,
        photo_url: body.photo_url ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
