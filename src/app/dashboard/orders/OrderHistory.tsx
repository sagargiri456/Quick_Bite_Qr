// src/app/dashboard/orderhistory/page.tsx

import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, CircleDollarSign, AlertCircle } from 'lucide-react';

// Define the type for our orders directly in this file
type HistoricalOrder = {
  id: string;
  track_code: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';
  total_amount: number;
};

// Helper functions can be defined at the top level
const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'complete': return 'default';
        case 'cancelled': return 'destructive';
        default: return 'secondary';
    }
};

// This is an async Server Component
export default async function OrderHistoryPage() {
  const supabase = createServerClient();

  // 1. Get the authenticated user (server-side)
  const { data: { user } } = await (await supabase).auth.getUser();
  if (!user) {
    redirect('/login'); // Redirect if not logged in
  }

  // 2. Find the user's restaurant
  const { data: restaurant, error: restaurantError } = await (await supabase)
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (restaurantError || !restaurant) {
    return (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg m-4">
            <AlertCircle className="inline-block mr-2" />
            Error: Could not find a restaurant associated with your account.
        </div>
    );
  }

  // 3. Fetch all orders
  const { data: orders, error: ordersError } = await (await supabase)
    .from("orders")
    .select("id, status, total_amount, created_at, track_code")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
     return (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg m-4">
            <AlertCircle className="inline-block mr-2" />
            Error: {ordersError.message}
        </div>
    );
  }
  
  // 4. Render the UI
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Order History</h1>
          <p className="text-slate-500">Showing all completed or cancelled orders.</p>
      </div>
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {(orders as HistoricalOrder[]).map((order) => (
            <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Tag className="h-4 w-4 text-slate-500" />
                       <span className="font-mono text-sm font-semibold text-slate-800">{order.track_code}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(order.created_at)}</span>
                     </div>
                  </div>
                  <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                </div>
                <div className="border-t my-3"></div>
                <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-600">Total</span>
                     <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CircleDollarSign className="h-4 w-4 text-green-600" />
                        <span>{order.total_amount.toFixed(2)}</span>
                     </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-slate-800">No Orders Found</h3>
          <p className="text-slate-500">There are no orders in your history yet.</p>
        </div>
      )}
    </div>
  );
};

