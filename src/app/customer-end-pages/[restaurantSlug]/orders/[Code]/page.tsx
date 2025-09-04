import { createServerClient } from '@/lib/supabase/server';
import StatusClient from './StatusClient';
import { notFound } from 'next/navigation';
import { OrderItem } from '@/app/customer-end-pages/store/cartStore';

type PageProps = {
  params: {
    restaurantSlug: string;
    code: string;
  };
};

// Define a more specific type for order items
type OrderItemWithDetails = {
  quantity: number;
  price: number;
  menu_items: {
    name: string;
  } | null;
};

export default async function OrderTrackPage({ params }: PageProps) {
  const { restaurantSlug, code } = params;
  const supabase = await createServerClient();

  // Step 1: Fetch order by tracking code
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, track_code, status, total_amount, estimated_time, created_at, restaurant_id')
    .eq('track_code', code)
    .single();

  if (orderError || !order) {
    notFound();
  }
  
  // Step 2: Fetch the associated restaurant details, including the logo
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('restaurant_name, slug, logo_url')
    .eq('id', order.restaurant_id)
    .single();

  if (restaurantError || !restaurant) {
    return <div className="p-8 text-center text-red-600">Error: Could not find restaurant information.</div>;
  }

  // Step 3: Fetch the items associated with the order
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      menu_items ( name )
    `)
    .eq('order_id', order.id);

  if (itemsError) {
    console.error(`Error fetching items for order ${order.id}:`, itemsError);
    // Continue without items if there's an error
  }


  // Step 4: Validate the URL slug
  if (restaurant.slug !== restaurantSlug) {
    notFound();
  }

  // All data is valid, now render the client component with the new props.
  return (
    <StatusClient
      initialOrder={{
        id: order.id,
        trackCode: order.track_code,
        status: order.status,
        eta: order.estimated_time,
        createdAt: order.created_at,
        totalAmount: order.total_amount,
        items: (orderItems as OrderItemWithDetails[] | null) || [],
      }}
      restaurant={{
        name: restaurant.restaurant_name,
        logoUrl: restaurant.logo_url
      }}
    />
  );
}