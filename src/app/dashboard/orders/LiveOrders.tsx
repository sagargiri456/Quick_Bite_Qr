"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR from 'swr';
import LiveOrdersComponent from "@/components/LiveOrdersComponent";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Order, OrderStatus } from "./OrderTypes";

// FIXED: Add { credentials: 'include' } to the fetch call
const fetcher = async (url: string): Promise<Order[]> => {
  const res = await fetch(url, { credentials: 'include' });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorBody.error || 'Failed to fetch data.');
  }
  return res.json();
};


const LiveOrders = () => {
  // The useSWR hook will now use the corrected fetcher
  const { data: liveOrders, error, mutate, isLoading } = useSWR<Order[]>('/api/orders', fetcher);

  // ... The rest of this file is correct and does not need to be changed ...
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const channel = supabase
      .channel('live-orders-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        mutate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

    const filteredOrders = useMemo((): Order[] => {
    if (!Array.isArray(liveOrders)) return [];
    
    let orders = liveOrders.filter(o => o.status !== 'complete' && o.status !== 'cancelled');
    
    if (activeStatus !== "All") {
      orders = orders.filter((o) => o.status === activeStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      orders = orders.filter((order) =>
        order.track_code.toLowerCase().includes(q) ||
        (order.tables?.table_number || "").toLowerCase().includes(q) ||
        order.order_items.some(item => item.menu_items?.name.toLowerCase().includes(q))
      );
    }
    return orders;
  }, [liveOrders, activeStatus, search]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Live Orders</h2>
          {error && (
            <div className="mt-2 flex items-center gap-2 bg-red-100 border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error.message}</span>
            </div>
          )}
        </div>
        <Input
          placeholder="Search by track code, table, or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <LiveOrdersComponent
        filteredOrders={filteredOrders}
        fetchLiveOrders={mutate}
      />
    </div>
  );
};

export default LiveOrders;