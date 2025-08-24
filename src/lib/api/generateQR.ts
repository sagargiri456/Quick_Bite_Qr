// lib/api.ts
export const generateQR = async (restaurantId: string, tableNumber: number) => {
  const res = await fetch("/api/create-table", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId, tableNumber }),
  });

  if (!res.ok) {
  const errorText = await res.text();
  console.error("Supabase function failed:", res.status, errorText);
  throw new Error(`Failed to generate QR: ${errorText}`);
}

  const { url } = await res.json();
  return url;
};
