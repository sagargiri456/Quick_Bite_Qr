// src/lib/api/orders.ts
import { CartItem } from '@/app/customer-end-pages/store/cartStore';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';
export type CustomerOrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Complete' | 'Cancelled';

export type OrderRow = {
  id: string;
  restaurant_id: string;
  track_code: string;
  table_id: number | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  estimated_time: number | null;
  status_updated_at?: string | null;
};

/**
 * Submits a new order via the backend API.
 */
export async function submitOrder(
  cartItems: CartItem[],
  restaurantId: string,
  tableId: string,
  totalAmount: number
): Promise<{ success: boolean; trackCode: string; restaurantSlug: string }> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ cartItems, restaurantId, tableId, totalAmount }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Could not create order.');
  }

  return res.json();
}

/**
 * Get order details from backend.
 */
export async function getOrderById(orderId: string): Promise<OrderRow | null> {
  const res = await fetch(`/api/orders/${orderId}`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Update order status (and optional ETA) via backend.
 */
export async function setOrderStatus(
  orderId: string,
  status: CustomerOrderStatus | OrderStatus,
  etaMinutes?: number | null
): Promise<OrderRow> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status, etaMinutes }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update order status.');
  }

  return res.json();
}

/**
 * Convenience wrapper to update only ETA.
 */
export async function setOrderEta(orderId: string, etaMinutes: number | null): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${orderId}/eta`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ etaMinutes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
