// File: app/api/create-table/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { restaurantId, tableNumber } = await req.json();

    // Call your Supabase Edge Function
const res = await fetch(
  "https://melkeknoniqnnlanhobo.functions.supabase.co/generate-table-qr",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, 
      // or SUPABASE_SERVICE_ROLE_KEY if you want more power (be careful!)
    },
    body: JSON.stringify({ restaurantId, tableNumber }),
  }
);

    if (!res.ok) {
      const errorText = await res.text();
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
