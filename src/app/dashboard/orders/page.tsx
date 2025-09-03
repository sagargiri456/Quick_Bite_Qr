// src/app/dashboard/orders/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import LiveOrdersComponent from '@/components/LiveOrdersComponent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Order, OrderStatus } from './OrderTypes';

// This is a new type definition file needed for the orders page.
// Create a new file at: src/app/dashboard/orders/OrderTypes.ts
/*
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menu_items: {
    name: string;
  } | null;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  track_code: string;
  order_items: OrderItem[];
  restaurants: {
    restaurant_name: string;
    slug: string;
  } | null;
  tables: {
    table_number: string;
  } | null;
};
*/

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch orders.');
      }
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Live Orders</h1>
            <p className="text-gray-600 mt-1">View and manage incoming orders in real-time.</p>
          </div>
          <Button onClick={() => fetchOrders()} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center gap-4">
            <AlertCircle className="h-8 w-8" />
            <div>
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LiveOrdersComponent fetchLiveOrders={fetchOrders} filteredOrders={orders} />
          </motion.div>
        )}
      </div>
    </div>
  );
}