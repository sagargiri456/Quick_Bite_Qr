// src/app/customer-end-pages/[restaurantSlug]/orders/[code]/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import StatusClient from './StatusClient';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Record<string, any> | Promise<Record<string, any>>;
};

export default async function OrderTrackPage({ params }: PageProps) {
  // await params because Next may pass a thenable
  const p = (await params) ?? {};

  // Accept multiple possible param names so this file works even if you rename later
  const restaurantSlug = p.restaurantSlug || p.restaurant || p.slug;
  const orderCode = p.code || p.orderCode || p.track_code || p.trackCode;

  if (!restaurantSlug || !orderCode) return notFound();

  const supabase = await createServerClient();

  // Fetch order by track_code
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, track_code, status, total_amount, estimated_time, created_at, restaurant_id')
    .eq('track_code', orderCode)
    .single();

  if (orderError || !order) {
    console.error(`OrderTrackPage: Could not find order with code "${orderCode}"`, orderError);
    return notFound();
  }

  // Fetch restaurant and validate slug
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('restaurant_name, slug, logo_url')
    .eq('id', order.restaurant_id)
    .single();

  if (restaurantError || !restaurant) {
    console.error('OrderTrackPage: restaurant not found', restaurantError);
    return <div className="p-8 text-center text-red-600">Error: Could not find restaurant information for this order.</div>;
  }

  if (restaurant.slug !== restaurantSlug) return notFound();

  // Fetch order items (optional display)
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('quantity, price, menu_item, menu_items ( name )')
    .eq('order_id', order.id);

  if (itemsError) console.error('Error fetching order items:', itemsError);

  return (
    <StatusClient
      initialOrder={{
        id: order.id,
        trackCode: order.track_code,
        status: order.status,
        eta: order.estimated_time,
        createdAt: order.created_at,
        totalAmount: order.total_amount,
        items: (orderItems ?? []) as any[],
      }}
      restaurant={{
        name: restaurant.restaurant_name,
        logoUrl: restaurant.logo_url,
      }}
    />
  );
}
