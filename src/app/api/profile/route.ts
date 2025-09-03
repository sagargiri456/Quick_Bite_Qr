// src/app/api/profile/route.ts

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET restaurant profile for current user
export async function GET() {
  const supabase = createServerClient(); // FIXED: Removed await

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Profile not found for this user." }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT update restaurant profile
export async function PUT(req: Request) {
  const supabase = createServerClient(); // FIXED: Removed await
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { restaurant_name, phone, address, upi_id, logo_url, banner_url, description } = body;

  const { data, error } = await supabase
    .from("restaurants")
    .update({
      restaurant_name,
      phone,
      address,
      upi_id,
      logo_url,
      banner_url,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}