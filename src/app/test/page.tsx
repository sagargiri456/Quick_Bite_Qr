'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        // Test 1: Get all orders
        const { data: allOrders, error: allError } = await supabase
          .from('orders')
          .select('*')
          .limit(10);

        if (allError) {
          setError(`Error fetching all orders: ${allError.message}`);
          return;
        }

        console.log('All orders:', allOrders);
        setOrders(allOrders || []);

        // Test 2: Get specific order by track_code
        const { data: specificOrder, error: specificError } = await supabase
          .from('orders')
          .select(`
            id, track_code, status, estimated_time, created_at,
            restaurant:restaurants (restaurant_name, slug),
            table:tables (table_number)
          `)
          .eq('track_code', 'upmi0jl0');

        if (specificError) {
          console.error('Error fetching specific order:', specificError);
        } else {
          console.log('Specific order for upmi0jl0:', specificOrder);
        }

        // Test 3: Get all restaurants
        const { data: restaurants, error: restaurantsError } = await supabase
          .from('restaurants')
          .select('id, restaurant_name, slug');

        if (restaurantsError) {
          console.error('Error fetching restaurants:', restaurantsError);
        } else {
          console.log('All restaurants:', restaurants);
          setRestaurants(restaurants || []);
        }

      } catch (err) {
        setError(`Unexpected error: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      <h2 className="text-xl font-semibold mb-2">Recent Orders:</h2>
      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="border p-3 rounded">
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>Track Code:</strong> {order.track_code}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Restaurant ID:</strong> {order.restaurant_id}</p>
            <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-6">Restaurants:</h2>
      <div className="space-y-2">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="border p-3 rounded">
            <p><strong>ID:</strong> {restaurant.id}</p>
            <p><strong>Name:</strong> {restaurant.restaurant_name}</p>
            <p><strong>Slug:</strong> {restaurant.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
