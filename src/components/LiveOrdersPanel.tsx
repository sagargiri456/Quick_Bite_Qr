"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X } from "lucide-react";

type Order = {
  id: string;
  table_id: number | string;
  status: string;
  total_amount: number | string;
  created_at: string;
  estimated_time: number | string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  quantity: number;
  price: number | string;
  created_at: string;
  menu_item: number;
};

export function LiveOrdersPanel() {
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      if (res.ok) {
        setLiveOrders(await res.json());
      }
    }
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  const totals = useMemo(() => {
    const totalValue = liveOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const readyCount = liveOrders.filter((o) => o.status === "Ready").length;
    return { totalValue, readyCount };
  }, [liveOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready": return "bg-green-100 text-green-800 border-green-200";
      case "Served": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-blue-600 text-white ${isPulsing ? "animate-pulse" : ""}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Live Orders</CardTitle>
              <p className="text-slate-600 text-sm">Real-time order tracking</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{liveOrders.length}</div>
              <div className="text-xs text-slate-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totals.readyCount}</div>
              <div className="text-xs text-slate-600">Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${totals.totalValue.toFixed(2)}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveOrders.map((order) => (
          <Card
            key={order.id}
            onClick={() => setOpenOrderId(order.id)}
            className="relative cursor-pointer hover:shadow-lg transition-all"
          >
            <CardHeader className="pb-3 flex justify-between">
              <span className="font-medium">#{order.id}</span>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p>Table: {order.table_id}</p>
              <p>Amount: ${Number(order.total_amount).toFixed(2)}</p>
              <p>Time: {new Date(order.created_at).toLocaleTimeString()}</p>
              {order.estimated_time && <p>ETA: {order.estimated_time} min</p>}
            </CardContent>
            {openOrderId === order.id && (
              <OrderItemsOverlay orderId={order.id} onClose={() => setOpenOrderId(null)} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrderItemsOverlay({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}/items`);
      if (res.ok) setItems(await res.json());
      setLoading(false);
    }
    fetchItems();
  }, [orderId]);

  const orderTotal = items.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );

  return (
    <div className="absolute inset-0 z-30 rounded-2xl bg-blue-200/95 backdrop-blur-md p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Items for Order #{orderId}</h3>
        <button onClick={onClose}><X className="w-5 h-5 text-slate-600" /></button>
      </div>
      {loading ? (
        <p>Loading items…</p>
      ) : items.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <div className="max-h-60 overflow-auto space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between border p-2 rounded">
              <div>
                <p className="font-medium">Item #{it.menu_item}</p>
                <p className="text-xs">Qty: {it.quantity} • ${Number(it.price).toFixed(2)} each</p>
              </div>
              <p className="font-semibold">${(Number(it.price) * it.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex justify-between border-t pt-3">
        <span>Total</span>
        <span className="font-bold">${orderTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
