// src/app/customer-end-pages/[restaurantSlug]/orders/[code]/StatusClient.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = { quantity: number; price: number; menu_items?: { name: string } | null };

export default function StatusClient({
  initialOrder,
  restaurant,
}: {
  initialOrder: {
    id: string;
    trackCode: string;
    status: string;
    eta?: number | null;
    createdAt: string;
    totalAmount: number;
    items: Item[];
  };
  restaurant: { name: string; logoUrl?: string | null };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialOrder.status);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!initialOrder.trackCode) return;

    // only poll while waiting for payment (or you can poll always)
    const poll = async () => {
      try {
        const res = await fetch(`/api/public/orders/${initialOrder.trackCode}/status`);
        if (!res.ok) {
          setError('Failed to fetch status');
          return;
        }
        const json = await res.json();
        if (!mounted) return;
        if (json.status && json.status !== status) {
          setStatus(json.status);
          // If payment confirmed or status changed away from pending, refresh page data
          if (json.status !== 'payment_pending') {
            router.refresh();
          }
        }
      } catch (err) {
        console.error('Status poll error', err);
        if (mounted) setError('Network error while polling status');
      }
    };

    // initial poll and then interval
    poll();
    const t = setInterval(poll, 3000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [initialOrder.trackCode, status, router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracking code: <span className="font-mono">{initialOrder.trackCode}</span>
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Current status</div>
            <div className="text-lg font-semibold mt-1">{status}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Order placed</div>
              <div className="text-sm mt-1">{new Date(initialOrder.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-bold mt-1">₹{initialOrder.totalAmount}</div>
            </div>
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </section>

        {/* Optional: list items */}
        {initialOrder.items && initialOrder.items.length > 0 && (
          <section className="mt-6 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Your Order</h2>
            <ul className="space-y-3">
              {initialOrder.items.map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <div className="text-sm">{(it.menu_items && it.menu_items.name) || 'Item' } x {it.quantity}</div>
                  <div className="font-medium">₹{it.price}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
