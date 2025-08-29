"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { RecentOrders } from "@/components/RecentOrders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X } from "lucide-react";

interface Props {
  dateRange?: any;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  id: string;                 // uuid
  table_id: number | string;
  status: "Preparing" | "Ready" | "Served" | string;
  total_amount: number | string;
  created_at: string;
  estimated_time: number | string | null;
};

type OrderItem = {
  id: string;                 // uuid
  order_id: string;           // FK → orders.id
  quantity: number;
  price: number | string;     // numeric comes back as string from PG
  created_at: string;
  menu_item: number;          // refers to a menu_items.id (int8)
};

export function LiveOrdersPanel({ dateRange }: Props) {
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  // which order card is open (overlay)
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("id, table_id, status, total_amount, created_at, estimated_time")
        .order("created_at", { ascending: false })
        .limit(12);

      if (!error && data) setLiveOrders(data as Order[]);
    }

    fetchOrders();

    // realtime: new orders
    const ch = supabase
      .channel("orders-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setLiveOrders((prev) => [payload.new as Order, ...prev].slice(0, 12));
          setNewOrderCount((c) => c + 1);
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready": return "bg-green-100 text-green-800 border-green-200";
      case "Served": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // compute header stats safely (numeric may be string)
  const totals = useMemo(() => {
    const totalValue = liveOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const readyCount = liveOrders.filter((o) => o.status === "completed").length;
    return { totalValue, readyCount };
  }, [liveOrders]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Live Orders Header with Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-blue-600 text-white transition-all duration-300 ${isPulsing ? "animate-pulse animate-glow" : ""}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Live Orders</CardTitle>
                <p className="text-slate-600 text-sm">Real-time order tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{liveOrders.length}</div>
                <div className="text-xs text-slate-600">Active Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totals.readyCount}</div>
                <div className="text-xs text-slate-600">Ready to Serve</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">${totals.totalValue.toFixed(2)}</div>
                <div className="text-xs text-slate-600">Total Value</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveOrders.map((order, index) => (
          <Card
            key={order.id}
            onClick={() => setOpenOrderId(order.id)}
            className={`relative cursor-pointer hover:shadow-lg transition-all duration-300 animate-slide-up ${
              index === 0 && newOrderCount > 0 ? "animate-pulse border-blue-300 animate-glow" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">#{order.id}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Table:</span>
                <span className="font-medium">{order.table_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Amount:</span>
                <span className="font-medium text-green-600">${Number(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Time:</span>
                <span className="font-medium text-blue-600">{new Date(order.created_at).toLocaleTimeString()}</span>
              </div>
              {order.estimated_time && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">ETA:</span>
                  <span className="font-medium text-purple-600">{order.estimated_time}</span>
                </div>
              )}
            </CardContent>

            {/* Overlay with order_items (only for the clicked card) */}
            {openOrderId === order.id && (
              <OrderItemsOverlay
                orderId={order.id}
                onClose={(e) => {
                  e.stopPropagation();
                  setOpenOrderId(null);
                }}
              />
            )}
          </Card>
        ))}
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Overlay Component (fetches order_items by FK) ---------- */

function OrderItemsOverlay({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: (e: React.MouseEvent) => void;
}) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from("order_items")
        .select("id, order_id, quantity, price, created_at, menu_item")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (!error && mounted) setItems((data || []) as OrderItem[]);
      setLoading(false);
    }

    fetchItems();

    // realtime inserts for this order_id
    const channel = supabase
      .channel(`order-items-${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_items", filter: `order_id=eq.${orderId}` },
        (payload) => setItems((prev) => [...prev, payload.new as OrderItem])
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const orderTotal = items.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );

  return (
    <div
      className="absolute inset-0 z-30 rounded-2xl bg-blue-200/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4"
      onClick={(e) => e.stopPropagation()} // don't close when clicking inside
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Items for Order #{orderId}</h3>
          <p className="text-xs text-slate-500">Live updates</p>
        </div>
        <button
          aria-label="Close"
          onClick={onClose}
          className="rounded-full p-1 hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading items…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-slate-500">No items yet for this order.</div>
      ) : (
        <div className="max-h-60 overflow-auto space-y-2 pr-1">
          {items.map((it) => {
            const lineTotal = Number(it.price) * Number(it.quantity);
            return (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
              >
                <div className="text-sm">
                  <div className="font-medium">
                    {/* If you have a relation to menu_items, replace with the name */}
                    Item #{it.menu_item}
                  </div>
                  <div className="text-xs text-slate-500">
                    Qty: {it.quantity} • ₹{Number(it.price).toFixed(2)} each
                  </div>
                </div>
                <div className="text-sm font-semibold">₹{lineTotal.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-sm text-slate-600">Items Total</span>
        <span className="text-base font-bold">₹{orderTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
