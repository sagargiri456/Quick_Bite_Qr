"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Clock, ChefHat, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Order, OrderStatus } from "@/app/dashboard/orders/OrderTypes";
import { setOrderStatus } from "@/lib/api/orders";
import { toast } from "sonner";

interface Props {
  fetchLiveOrders: () => void;
  filteredOrders: Order[];
}

const ETA_PRESETS = [10, 15, 20, 25, 30];
const STATUS_OPTIONS: (OrderStatus|"All")[] = ["All", "pending", "confirmed", "preparing", "ready"];


const LiveOrdersComponent: React.FC<Props> = ({ fetchLiveOrders, filteredOrders }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "All">("All");

  const handleUpdate = async (orderId: string, status: OrderStatus, eta?: number) => {
    setUpdatingId(orderId);
    try {
      await setOrderStatus(orderId, status, eta);
      toast.success(`Order #${orderId.slice(-6)} updated to ${status}.`);
      fetchLiveOrders(); // Re-fetch data to update the view
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
    ? filteredOrders
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
          <div className="space-y-4">
            {ordersToDisplay.map((order) => {
              const isUpdating = updatingId === order.id;
              return (
                <Card key={order.id} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Table {order.tables?.table_number || 'N/A'} - Order #{order.id.slice(-6)}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize flex items-center gap-2">
                        {getStatusIcon(order.status)} {order.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      <Link href={`/customer-end-pages/${order.restaurants?.restaurant_name.toLowerCase().replace(/\s+/g, '-')}/orders/${order.track_code}`} target="_blank" className="text-blue-600 hover:underline text-xs font-mono">
                        Track Code: {order.track_code}
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                     {/* Action Buttons based on current status */}
                     {order.status === 'pending' && (
                        <Button size="sm" disabled={isUpdating} onClick={() => handleUpdate(order.id, "confirmed")}>
                           Confirm Order
                        </Button>
                     )}
                     {order.status === 'confirmed' && (
                        <Button size="sm" disabled={isUpdating} onClick={() => handleUpdate(order.id, "preparing", 15)}>
                           Start Preparing
                        </Button>
                     )}
                      {order.status === 'preparing' && (
                        <Button size="sm" variant="secondary" disabled={isUpdating} onClick={() => handleUpdate(order.id, "ready")}>
                           Mark as Ready
                        </Button>
                     )}
                      <Button size="sm" variant="destructive" disabled={isUpdating || order.status === 'ready' || order.status === 'complete'} onClick={() => handleUpdate(order.id, "cancelled")}>
                        Cancel
                      </Button>
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