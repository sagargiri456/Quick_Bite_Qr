"use client";

import React, { useEffect, useMemo, useState } from "react";
import LiveOrdersComponent from "@/components/LiveOrdersComponent";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

export type OrderItemStatus = "Pending" | "Confirmed" | "Preparing" | "Ready" | "Cancelled";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  status: OrderItemStatus | null;
  created_at: string;
  order: {
    id: string;
    track_code: string | null;
    table_id: string | null;
    table_number: string | null;
    restaurant: { id: string; name: string; user_id: string };
  };
  menu_item: { id: string; name: string };
}

// API fetcher
async function fetchLiveOrdersApi(): Promise<OrderItem[]> {
  const res = await fetch("/api/orders/live", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

const LiveOrders = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveOrders, setLiveOrders] = useState<OrderItem[]>([]);
  const [activeStatus, setActiveStatus] = useState<OrderItemStatus | "All">("All");
  const [search, setSearch] = useState("");

  const fetchLiveOrders = async () => {
    setRefreshing(true);
    try {
      const data = await fetchLiveOrdersApi();
      setLiveOrders(data);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
    // ✅ realtime should still work, but now trigger refetch
    const evt = new EventSource("/api/orders/stream"); // you can back this with Supabase realtime server proxy
    evt.onmessage = () => fetchLiveOrders();
    return () => evt.close();
  }, []);

  const filteredOrders = useMemo(() => {
    let orders = [...liveOrders];
    if (activeStatus !== "All") {
      orders = orders.filter((o) => o.status === activeStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      orders = orders.filter((o) =>
        (o.order.track_code || "").toLowerCase().includes(q) ||
        (o.order.table_number || "").toLowerCase().includes(q) ||
        (o.menu_item.name || "").toLowerCase().includes(q) ||
        (o.order.restaurant.name || "").toLowerCase().includes(q) ||
        (o.status || "").toLowerCase().includes(q)
      );
    }
    return orders;
  }, [liveOrders, activeStatus, search]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>;
  }

  return (
    <div>
      {/* ✅ UI unchanged */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Live Orders</h2>
          {errorMsg && (
            <div className="mt-2 flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
        <Input
          placeholder="Search by track code, table, item, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <LiveOrdersComponent
        liveOrders={liveOrders}
        filteredOrders={filteredOrders}
        refreshing={refreshing}
        fetchLiveOrders={fetchLiveOrders}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        formatDate={(iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        getTotalPrice={(orders) => (orders ?? []).reduce((sum, o) => sum + o.price * o.quantity, 0)}
        errorMsg={errorMsg}
      />
    </div>
  );
};

export default LiveOrders;
