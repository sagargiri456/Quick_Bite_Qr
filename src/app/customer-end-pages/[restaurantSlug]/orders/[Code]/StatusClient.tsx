'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

type OrderItem = {
  quantity: number;
  price: number;
  menu_item?: string | null;
  menu_items?: { name?: string } | null;
};

type InitialOrder = {
  id: string;
  trackCode: string;
  status: string;
  eta?: number | null;
  createdAt: string;
  totalAmount: number;
  items?: OrderItem[];
};

type Restaurant = {
  name?: string;
  logoUrl?: string | null;
};

export default function StatusClient({
  initialOrder,
  restaurant,
}: {
  initialOrder: InitialOrder;
  restaurant: Restaurant;
}) {
  const [order, setOrder] = useState<InitialOrder>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll the public status endpoint every 6s to reflect real-time changes
  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/public/orders/${order.trackCode}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // Expecting { status: 'confirmed', total_amount, estimated_time, created_at, items: [...] }
        setOrder((prev) => ({
          ...prev,
          status: data.status ?? prev.status,
          eta: data.estimated_time ?? prev.eta,
          createdAt: data.created_at ?? prev.createdAt,
          totalAmount: data.total_amount ?? prev.totalAmount,
          items: data.items ?? prev.items,
        }));
      } catch (err) {
        // ignore polling transient errors
      }
    }

    const interval = setInterval(fetchStatus, 6000);
    // initial fetch
    fetchStatus();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [order.trackCode]);

  const statusToLabel = (s: string) => {
    if (!s) return 'pending';
    return s.toLowerCase();
  };

  const statusBadge = (s: string) => {
    const lower = statusToLabel(s);
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold';
    switch (lower) {
      case 'pending':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
      case 'paid':
      case 'prepaid':
        return `${base} bg-green-100 text-green-800`;
      case 'preparing':
        return `${base} bg-blue-100 text-blue-800`;
      case 'ready':
        return `${base} bg-indigo-100 text-indigo-800`;
      case 'cancelled':
      case 'failed':
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700">
          {restaurant?.name ? restaurant.name.charAt(0).toUpperCase() : 'R'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{restaurant?.name ?? 'Restaurant'}</h1>
          <p className="text-sm text-muted-foreground">Order Status</p>
        </div>
      </div>

      {/* Top info card */}
      <div className="rounded-lg bg-white shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <div className="text-sm text-muted-foreground">Tracking Code</div>
            <div className="font-semibold">{order.trackCode}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Order Placed</div>
            <div className="font-semibold">
              {order.createdAt ? format(new Date(order.createdAt), 'PPP, p') : '—'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-bold text-lg">₹{Number(order.totalAmount ?? 0).toFixed(2)}</div>
            <div className="mt-2">
              <span className={statusBadge(order.status)}>{order.status ?? 'pending'}</span>
            </div>
          </div>
        </div>
        {/* Order items summary */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Your Order</h3>
          <div className="divide-y">
            {(order.items ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground py-3">No items available.</div>
            ) : (
              (order.items ?? []).map((it: OrderItem, idx: number) => {
                const name = it.menu_items?.name ?? (typeof it.menu_item === 'string' ? it.menu_item : 'Item');
                return (
                  <div key={idx} className="flex justify-between items-center py-3">
                    <div className="text-sm text-gray-700">{name} x {it.quantity}</div>
                    <div className="text-sm font-medium">₹{Number(it.price ?? 0).toFixed(2)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Layout: timeline left / details right (stack on narrow screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div>
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="font-semibold mb-4">Order Progress</h3>
            <div className="text-sm text-muted-foreground mb-3 text-right">Estimated Time: {order.eta ? `${order.eta}m` : 'N/A'}</div>
            <OrderTimeline currentStatus={order.status ?? 'pending'} />
          </div>
        </div>

        {/* Right column: details & actions (simple for customers) */}
        <div>
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="font-semibold mb-2">Details</h3>
            <dl className="grid grid-cols-1 gap-y-2 text-sm text-muted-foreground">
              <div>
                <dt className="text-xs">Tracking code</dt>
                <dd className="text-gray-700">{order.trackCode}</dd>
              </div>
              <div>
                <dt className="text-xs">Status</dt>
                <dd className="text-gray-700">{order.status}</dd>
              </div>
              <div>
                <dt className="text-xs">Placed</dt>
                <dd className="text-gray-700">{order.createdAt ? format(new Date(order.createdAt), 'PPP, p') : '—'}</dd>
              </div>
              <div>
                <dt className="text-xs">Total amount</dt>
                <dd className="text-gray-700">₹{Number(order.totalAmount ?? 0).toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {/* Optional: small note / contact */}
          <div className="mt-4 rounded-lg bg-white shadow p-4 text-sm text-muted-foreground">
            <p>If you have issues with payment or order, please contact the restaurant.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Simple timeline component — map your order status into a sequence and highlight current.
 */
function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  // canonical progression (lowercase)
  const steps = [
    { key: 'payment_pending', label: 'Payment confirmation' },
    { key: 'pending', label: 'Order received' },
    { key: 'confirmed', label: 'Order confirmed' },
    { key: 'preparing', label: 'Being cooked' },
    { key: 'ready', label: 'Ready to serve' },
    { key: 'complete', label: 'Complete' },
  ];

  // normalize incoming status
  const norm = (s = '') => s.toString().toLowerCase();
  const current = norm(currentStatus);

  // determine index of active step — try to match several mappings
  const statusToIndex = (s: string) => {
    s = norm(s);
    if (s === 'paid' || s === 'prepaid') return 1; // treat as after payment
    if (s === 'payment_pending' || s === 'pending') return 1;
    if (s === 'confirmed') return 2;
    if (s === 'preparing') return 3;
    if (s === 'ready') return 4;
    if (s === 'complete') return 5;
    if (s === 'cancelled' || s === 'failed') return -1;
    return 0;
  };

  const activeIndex = statusToIndex(current);

  return (
    <div className="space-y-4">
      {steps.map((s, i) => {
        const isDone = activeIndex > i && activeIndex !== -1;
        const isActive = activeIndex === i;
        return (
          <div key={s.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full flex items-center justify-center ${isDone ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-500'}`}>
                {isDone ? '✓' : i + 1}
              </div>
              {i !== steps.length - 1 && <div className={`h-full w-px ${isDone ? 'bg-green-300' : 'bg-gray-200'} flex-1 mt-2`} />}
            </div>
            <div>
              <div className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{s.label}</div>
              <div className="text-sm text-muted-foreground">{isDone ? 'Completed' : isActive ? 'In progress' : 'Pending'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
