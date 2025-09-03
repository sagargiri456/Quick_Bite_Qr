import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();

  // First, get the current user's session to ensure they are authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { restaurantId, tableNumber } = await req.json();

    // Call your Supabase Edge Function
    const res = await fetch(
      "https://melkeknoniqnnlanhobo.functions.supabase.co/generate-table-qr",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // FIXED: Pass the user's actual access token (JWT) to the Edge Function
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ restaurantId, tableNumber }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      // Forward the error from the Supabase function
      return NextResponse.json(
        { error: `Supabase function failed: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, ...data });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}