// src/components/LiveOrdersComponent.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ChefHat, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Order, OrderStatus } from "@/app/dashboard/orders/OrderTypes";
import { setOrderStatus } from "@/lib/api/orders";
import { toast } from "sonner";

interface Props {
  fetchLiveOrders: () => void;
  filteredOrders: Order[];
}

const STATUS_OPTIONS: (OrderStatus|"All")[] = ["All", "pending", "confirmed", "preparing", "ready"];

const LiveOrdersComponent: React.FC<Props> = ({ fetchLiveOrders, filteredOrders }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "All">("All");

  const handleUpdate = async (orderId: string, status: OrderStatus, eta?: number) => {
    setUpdatingId(orderId);
    try {
      await setOrderStatus(orderId, status, eta);
      toast.success(`Order #${orderId.slice(-6)} updated to ${status}.`);
      fetchLiveOrders();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-orange-500" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "preparing": return <ChefHat className="h-4 w-4 text-yellow-500" />;
      case "ready": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const ordersToDisplay = activeStatus === 'All'
    ? filteredOrders.filter(o => o.status !== 'complete' && o.status !== 'cancelled')
    : filteredOrders.filter(o => o.status === activeStatus);

  return (
    <div className="space-y-4">
      <Tabs value={activeStatus} onValueChange={(v) => setActiveStatus(v as OrderStatus | "All")}>
        <TabsList className="grid w-full grid-cols-5">
          {STATUS_OPTIONS.map(s => (
            <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div>
        {ordersToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordersToDisplay.map((order) => {
              const isUpdating = updatingId === order.id;
              return (
                <Card key={order.id} className="shadow-md flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Table {order.tables?.table_number || 'N/A'} - #{order.track_code}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize flex items-center gap-2">
                        {getStatusIcon(order.status)} {order.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {/* FIXED: Use restaurant slug for the link */}
                      <Link href={`/customer-end-pages/${order.restaurants?.slug}/orders/${order.track_code}`} target="_blank" className="text-blue-600 hover:underline text-xs">
                        View Public Page
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="divide-y">
                      {order.order_items.map(item => (
                        <li key={item.id} className="flex justify-between py-2 text-sm">
                          <span>{item.quantity}x {item.menu_items?.name || 'Unknown Item'}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-3 mt-3 flex justify-end font-bold">
                      Total: ₹{order.total_amount.toFixed(2)}
                    </div>
                  </CardContent>
                  <div className="p-4 border-t bg-gray-50 flex flex-wrap items-center gap-2">
                    {isUpdating && <Loader2 className="h-5 w-5 animate-spin" />}
                    
                    {!isUpdating && order.status === 'pending' && (
                      <Button size="sm" disabled={isUpdating} onClick={() => handleUpdate(order.id, "confirmed")}>Confirm Order</Button>
                    )}
                    {!isUpdating && order.status === 'confirmed' && (
                      <Button size="sm" disabled={isUpdating} onClick={() => handleUpdate(order.id, "preparing", 15)}>Start Preparing</Button>
                    )}
                    {!isUpdating && order.status === 'preparing' && (
                      <Button size="sm" variant="secondary" disabled={isUpdating} onClick={() => handleUpdate(order.id, "ready")}>Mark as Ready</Button>
                    )}
                    {!isUpdating && (order.status === 'ready' || order.status === 'complete') && (
                       <p className="text-sm text-green-600">Order is ready for customer.</p>
                    )}
                    {!isUpdating && !['ready', 'complete', 'cancelled'].includes(order.status) && (
                      <Button size="sm" variant="destructive" disabled={isUpdating} onClick={() => handleUpdate(order.id, "cancelled")}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No live orders with status "{activeStatus}".</p>
        )}
      </div>
    </div>
  );
};

export default LiveOrdersComponent;