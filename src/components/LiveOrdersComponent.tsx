"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Clock, ChefHat, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { OrderItem, OrderItemStatus } from "@/app/dashboard/orders/LiveOrders";

interface Props {
  fetchLiveOrders: () => Promise<void>;
  refreshing: boolean;
  liveOrders: OrderItem[] | null;
  filteredOrders: OrderItem[] | null;
  activeStatus: OrderItemStatus | "All";
  setActiveStatus: (status: OrderItemStatus | "All") => void;
  formatDate: (dateString: string) => string;
  getTotalPrice: (orders: OrderItem[] | null) => number;
  errorMsg?: string | null;
}

const ETA_PRESETS = [10, 15, 20, 25, 30];

const LiveOrdersComponent: React.FC<Props> = ({
  fetchLiveOrders,
  refreshing,
  liveOrders,
  filteredOrders,
  activeStatus,
  setActiveStatus,
  formatDate,
  getTotalPrice,
  errorMsg,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [etaChoice, setEtaChoice] = useState<Record<string, number>>({});

  const handleUpdate = async (orderId: string, status: OrderItemStatus, eta?: number | null) => {
    try {
      setUpdatingId(orderId);
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, eta }),
      });
      await fetchLiveOrders();
    } catch (e: any) {
      alert(e?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: OrderItemStatus | null) => {
    switch (status) {
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Confirmed": return <CheckCircle className="h-4 w-4" />;
      case "Preparing": return <ChefHat className="h-4 w-4" />;
      case "Ready": return <CheckCircle className="h-4 w-4" />;
      case "Cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Live Orders</h1>
        <Button onClick={fetchLiveOrders} disabled={refreshing} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {errorMsg && <div className="mb-4 text-red-500">{errorMsg}</div>}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent>{liveOrders?.length || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>{liveOrders?.filter(o=>o.status==='Pending').length || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Value</CardTitle></CardHeader><CardContent>${getTotalPrice(liveOrders).toFixed(2)}</CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeStatus} onValueChange={(v)=>setActiveStatus(v as OrderItemStatus|"All")}>
        <TabsList className="mb-4 grid grid-cols-5">
          {["All","Pending","Confirmed","Preparing","Ready"].map(s => (
            <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
          ))}
        </TabsList>

        <div>
          {filteredOrders && filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.order.id;
                const eta = etaChoice[order.order.id] ?? 15;
                return (
                  <Card key={order.id}>
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>
                        #{order.order.id.slice(-6)} • 
                        <Link
                          href={`/customer-end-pages/${order.order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}/orders/${order.order.track_code}`}
                          target="_blank"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          Code: {order.order.track_code}
                        </Link>
                      </CardTitle>
                      <Badge>{getStatusIcon(order.status)} {order.status}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{order.menu_item?.name}</h3>
                          <p className="text-sm">Qty: {order.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(order.price * order.quantity).toFixed(2)}</p>
                          <p className="text-xs">${order.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" disabled={isUpdating || order.status!=="Pending"} onClick={() => handleUpdate(order.order.id,"Confirmed")}>
                          {isUpdating ? "Updating..." : "Confirm"}
                        </Button>
                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={eta}
                            onChange={(e)=>setEtaChoice(prev=>({...prev,[order.order.id]:Number(e.target.value)}))}
                            disabled={isUpdating}
                          >
                            {ETA_PRESETS.map(m => <option key={m} value={m}>{m} min</option>)}
                          </select>
                          <Button size="sm" disabled={isUpdating || !["Pending","Confirmed"].includes(order.status)} onClick={() => handleUpdate(order.order.id,"Preparing",eta)}>
                            {isUpdating ? "Updating..." : `Preparing (${eta}m)`}
                          </Button>
                        </div>
                        <Button size="sm" disabled={isUpdating || order.status!=="Preparing"} onClick={() => handleUpdate(order.order.id,"Ready")}>
                          {isUpdating ? "Updating..." : "Ready"}
                        </Button>
                        <Button size="sm" variant="destructive" disabled={isUpdating || order.status==="Ready"} onClick={() => handleUpdate(order.order.id,"Cancelled")}>
                          {isUpdating ? "Updating..." : "Cancel"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-12">No orders found for {activeStatus}</p>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default LiveOrdersComponent;
