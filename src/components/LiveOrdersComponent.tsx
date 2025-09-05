'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { OrderItem, OrderItemStatus } from '@/app/dashboard/orders/LiveOrders';
import { setOrderStatus } from '@/lib/api/orders';

interface LiveOrdersComponentProps {
  fetchLiveOrders: () => Promise<void>;
  refreshing: boolean;
  liveOrders: OrderItem[] | null;
  filteredOrders: OrderItem[] | null;
  activeStatus: OrderItemStatus | 'All';
  setActiveStatus: (status: OrderItemStatus | 'All') => void;
  formatDate: (dateString: string) => string;
  getTotalPrice: (orders: OrderItem[] | null) => number;
  errorMsg?: string | null;
}

const ETA_PRESETS = [10, 15, 20, 25, 30];

const LiveOrdersComponent: React.FC<LiveOrdersComponentProps> = ({
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
      await setOrderStatus(orderId, status, eta ?? null);
      await fetchLiveOrders();
    } catch (e: unknown) {
      console.error('[update status]', e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to update status';
      alert(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'Preparing': return <ChefHat className="h-4 w-4" />;
      case 'Ready': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Cancelled': return 'destructive';
      case 'Confirmed':
      case 'Preparing':
      case 'Ready': return 'default';
      case 'Pending':
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Live Orders</h1>
          <p className="text-muted-foreground">Manage active orders in real-time</p>
        </div>
        <Button onClick={fetchLiveOrders} disabled={refreshing} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent>{liveOrders?.length || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>{liveOrders?.filter(o=>o.status==='Pending').length || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Value</CardTitle></CardHeader><CardContent>₹{getTotalPrice(liveOrders).toFixed(2)}</CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeStatus} onValueChange={(v)=>setActiveStatus(v as OrderItemStatus|'All')}>
        <TabsList className="mb-4 grid grid-cols-5 w-full">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="Preparing">Preparing</TabsTrigger>
          <TabsTrigger value="Ready">Ready</TabsTrigger>
        </TabsList>

        <div>
          {filteredOrders && filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.order.id;
                const eta = etaChoice[order.order.id] ?? 15;
                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>
                            #{order.order.id.slice(-6)} • 
                            <Link
                              href={`/customer-end-pages/${order.order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}/orders/${order.order.track_code}`}
                              className="text-blue-600 hover:underline ml-1"
                              target="_blank"
                            >
                              Code: {order.order.track_code}
                            </Link>
                            {order.order.table_number && ` • Table ${order.order.table_number}`}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {order.order.restaurant.name} • {formatDate(order.created_at)}
                            {/* **MODIFIED:** Added Badge to show payment status */}
                            {order.order.is_prepaid ? (
                                <Badge variant="default" className="ml-2 bg-green-600 hover:bg-green-700 text-white">Prepaid</Badge>
                            ) : (
                                <Badge variant="secondary" className="ml-2">Pay on Table</Badge>
                            )}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)} {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{order.menu_item?.name}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(order.price * order.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">₹{order.price.toFixed(2)} each</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={isUpdating || order.status !== 'Pending'}
                          onClick={() => handleUpdate(order.order.id, 'Confirmed')}
                        >
                          {isUpdating ? 'Updating...' : 'Confirm'}
                        </Button>

                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded px-2 py-1 text-sm h-9"
                            value={eta}
                            onChange={(e) => setEtaChoice((prev) => ({ ...prev, [order.order.id]: Number(e.target.value) }))}
                            disabled={isUpdating}
                          >
                            {ETA_PRESETS.map((m) => (
                              <option key={m} value={m}>{m} min</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            disabled={isUpdating || (order.status !== 'Pending' && order.status !== 'Confirmed')}
                            onClick={() => handleUpdate(order.order.id, 'Preparing', eta)}
                          >
                            {isUpdating ? 'Updating...' : `Preparing (${eta}m)`}
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          disabled={isUpdating || order.status !== 'Preparing'}
                          onClick={() => handleUpdate(order.order.id, 'Ready')}
                        >
                          {isUpdating ? 'Updating...' : 'Ready'}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isUpdating || order.status === 'Ready'}
                          onClick={() => handleUpdate(order.order.id, 'Cancelled')}
                        >
                          {isUpdating ? 'Updating...' : 'Cancel'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {activeStatus === 'All'
                  ? "You don't have any active orders at the moment."
                  : `You don't have any orders with status "${activeStatus}".`}
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default LiveOrdersComponent;