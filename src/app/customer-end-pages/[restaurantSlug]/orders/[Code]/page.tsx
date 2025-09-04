// src/app/customer-end-pages/[restaurantSlug]/orders/[Code]/page.tsx

import { createServerClient } from '@/lib/supabase/server';
import StatusClient from './StatusClient';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    restaurantSlug: string;
    code: string; // Folder name is [Code], so prop is `code`
  };
};

export default async function OrderTrackPage({ params }: PageProps) {
  const { restaurantSlug, code } = params;
  const supabase = await createServerClient(); // FIXED: Removed await

  // Step 1: Fetch order by tracking code
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, track_code, status, estimated_time, created_at, restaurant_id')
    .eq('track_code', code)
    .single();

  if (orderError || !order) {
    console.log(`Order not found for code: ${code}.`);
    notFound();
  }

  // Step 2: Fetch the associated restaurant
  if (!order.restaurant_id) {
    console.error(`CRITICAL: Order ${order.id} is missing a restaurant_id.`);
    return <div className="p-8 text-center text-red-600">Error: Order data is corrupted.</div>;
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('restaurant_name, slug')
    .eq('id', order.restaurant_id)
    .single();

  if (restaurantError || !restaurant) {
    console.error(`CRITICAL: Restaurant not found for id: ${order.restaurant_id}.`);
    return <div className="p-8 text-center text-red-600">Error: Could not find restaurant information.</div>;
  }

  // Step 3: Validate the URL slug
  if (restaurant.slug !== restaurantSlug) {
    console.warn(`Slug mismatch. URL: "${restaurantSlug}", DB: "${restaurant.slug}"`);
    notFound();
  }

  // All data is valid, now render the client component with the correct props.
  return (
    <StatusClient
      trackCode={order.track_code}
      restaurantName={restaurant.restaurant_name}
      orderId={order.id} // Pass orderId for push notifications
      initialStatus={order.status}
      initialEta={order.estimated_time}
      createdAt={order.created_at}
    />
  );
}