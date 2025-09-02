"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { Utensils } from "lucide-react";

type OrderWithDetails = {
  id: string;
  total_amount: number;
  created_at: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "complete" | "cancelled";
  tables: { table_number: string } | null;
  restaurants: { restaurant_name: string } | null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ready":
    case "complete": return "bg-green-100 text-green-800 border-green-200";
    case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

async function fetchRecentOrdersApi(): Promise<OrderWithDetails[]> {
  const res = await fetch("/api/orders/recent", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export function RecentOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentOrdersApi()
      .then(setOrders)
      .catch(() => setError("Could not fetch recent orders."))
      .finally(() => setLoading(false));

    // realtime subscription proxy
    const evt = new EventSource("/api/orders/stream");
    evt.onmessage = () => fetchRecentOrdersApi().then(setOrders);
    return () => evt.close();
  }, []);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-12 rounded-full" /><Skeleton className="h-4 w-[250px]" /></div>;
  }
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <Utensils className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Orders</h3>
          <p className="mt-1 text-sm text-gray-500">New orders will appear here in real-time.</p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getInitials(order.tables?.table_number || "T")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Table {order.tables?.table_number || "N/A"}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${Number(order.total_amount).toFixed(2)}</p>
                  <Badge variant="outline" className={`mt-1 text-xs capitalize ${getStatusColor(order.status)}`}>{order.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
