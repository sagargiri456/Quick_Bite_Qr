// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createServerClient();

    // Assume profile update is for the current user's restaurant
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("restaurants")
      .update(body)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("[API:PUT /profile] Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API:PUT /profile] Exception:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
