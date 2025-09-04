// src/lib/api/orders.ts
import { supabase } from '@/lib/supabase/client';
import { CartItem } from '@/app/customer-end-pages/store/cartStore';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';
export type CustomerOrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Complete' | 'Cancelled';

const toDbStatus = (s: CustomerOrderStatus | OrderStatus): OrderStatus => {
  const map: Record<string, OrderStatus> = {
    Pending: 'pending', Confirmed: 'confirmed', Preparing: 'preparing',
    Ready: 'ready', Complete: 'complete', Cancelled: 'cancelled',
    pending: 'pending', confirmed: 'confirmed', preparing: 'preparing',
    ready: 'ready', complete: 'complete', cancelled: 'cancelled'
  };
  return map[s] ?? 'pending';
};

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
 * Create an order + items
 */
export const submitOrder = async (
  cartItems: CartItem[],
  restaurantId: string,
  tableId: number,
  totalAmount: number
) => {
  // 1) create order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: restaurantId,
      table_id: tableId,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select('id, track_code, restaurant_id')
    .single();

  if (orderError || !orderData?.id) {
    console.error('Error creating order:', orderError);
    throw new Error('Could not create the order.');
  }

  const orderId = orderData.id;
  const trackCode = orderData.track_code;

  // 2) add items
  const itemsToInsert = cartItems.map((item) => ({
    order_id: orderId,
    menu_item: item.id,
    quantity: item.quantity,
    price: item.price
  }));
  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
  if (itemsError) {
    console.error('Error inserting order items:', itemsError);
    throw new Error('Could not save the items for the order.');
  }

  // 3) fetch restaurant slug
  const { data: r } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('id', restaurantId)
    .single();

  const slug = r?.slug ?? '';

  return { success: true, orderId, trackCode, restaurantSlug: slug };
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<OrderRow | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('id, restaurant_id, track_code, table_id, total_amount, status, created_at, estimated_time, status_updated_at')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('getOrderById error:', error);
    return null;
  }
  return data as unknown as OrderRow;
};

/**
 * Update order status (+ optional ETA), also trigger push
 */
export const setOrderStatus = async (
  orderId: string,
  status: CustomerOrderStatus | OrderStatus,
  etaMinutes?: number | null,
  note?: string
) => {
  const dbStatus = toDbStatus(status);

  // update order
  const { data: updated, error } = await supabase
    .from('orders')
    .update({ status: dbStatus, estimated_time: etaMinutes ?? null })
    .eq('id', orderId)
    .select('*')
    .single();

  if (error) {
    console.error('setOrderStatus error:', error);
    throw error;
  }

  // fetch slug for URL
  let restaurantSlug = '';
  if (updated?.restaurant_id) {
    const { data: r } = await supabase
      .from('restaurants')
      .select('slug')
      .eq('id', updated.restaurant_id)
      .single();
    restaurantSlug = r?.slug ?? '';
  }

  // trigger push
  try {
    await fetch('/api/push/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        title: `Order ${titleFor(dbStatus)}`,
        body: typeof etaMinutes === 'number' ? `ETA: ${etaMinutes} min` : undefined,
        url: `/customer-end-pages/${restaurantSlug}/orders/${updated.track_code ?? ''}`
      })
    });
  } catch (err) {
    console.warn('[push notify] failed:', err);
  }

  return updated as OrderRow;
};

/** Convenience: update ETA only */
export const setOrderEta = async (orderId: string, etaMinutes: number | null) => {
  const current = await getOrderById(orderId);
  const status = current?.status ?? 'pending';
  await setOrderStatus(orderId, status, etaMinutes);
  return true;
};

const titleFor = (s: OrderStatus) =>
  ({ pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready', complete: 'Complete', cancelled: 'Cancelled' }[s]);
