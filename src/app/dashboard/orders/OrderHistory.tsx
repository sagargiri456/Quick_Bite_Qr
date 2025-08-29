"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, differenceInHours } from "date-fns";
import { supabase } from "@/lib/supabase/client";

type Order = {
  id: string;
  table_id: number;
  status: string;
  total_amount: number;
  created_at: string;
};

const statusOptions = ["All", "Ready", "Preparing", "Pending", "Delivered"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-green-100 text-green-800 border-green-200";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Delivered":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// 🔹 Fetcher for SWR (works with Supabase client)
const fetchOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, table_id, status, total_amount, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const now = new Date();
  return (data || []).filter((order) => {
    const createdAt = new Date(order.created_at);
    return differenceInHours(now, createdAt) >= 24;
  });
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // 🔹 SWR handles caching + revalidation
  const { data: orders = [], error, isLoading } = useSWR("orders-history", fetchOrders, {
    revalidateOnFocus: true, // refresh when tab is focused
    dedupingInterval: 10000, // avoid duplicate fetches within 10s
  });

  // 🔹 Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table_id.toString().includes(searchTerm.toLowerCase());

      const statusMatch =
        selectedStatus === "All" || order.status === selectedStatus;

      return searchMatch && statusMatch;
    });
  }, [orders, searchTerm, selectedStatus]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-slate-800 text-white">
              <Clock className="w-5 h-5" />
            </span>
            Order History
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              ))}
              {(searchTerm || selectedStatus !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("All");
                  }}
                >
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Orders older than 24 hrs ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Order ID</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Table</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Total</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Skeleton rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-12 bg-slate-200 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                      </tr>
                    ))
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`border-b hover:bg-slate-50/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-25"
                        }`}
                      >
                        <td className="p-4 font-mono text-slate-800">{order.id}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono">{order.table_id}</Badge>
                        </td>
                        <td className="p-4 font-semibold text-green-600">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`${getStatusColor(order.status)} border`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {format(new Date(order.created_at), "MMM dd, yyyy p")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 text-slate-300" />
                          <p>No past orders found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
