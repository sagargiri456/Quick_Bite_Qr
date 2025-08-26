import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock } from 'lucide-react';
import { OrderItem, OrderItemStatus } from '@/app/dashboard/orders/LiveOrders';

interface LiveOrdersComponentProps {
  fetchLiveOrders: () => Promise<void>;
  refreshing: boolean;
  liveOrders: OrderItem[] | null;
  filteredOrders: OrderItem[] | null;
  activeStatus: OrderItemStatus | 'All';
  setActiveStatus: (status: OrderItemStatus | 'All') => void;
  getStatusIcon: (status: OrderItemStatus | null) => React.ReactNode;
  getStatusVariant: (status: OrderItemStatus | null) => 'default' | 'secondary' | 'destructive';
  formatDate: (dateString: string) => string;
  getTotalPrice: (orders: OrderItem[] | null) => number;
}

const LiveOrdersComponent: React.FC<LiveOrdersComponentProps> = ({
  fetchLiveOrders,
  refreshing,
  liveOrders,
  filteredOrders,
  activeStatus,
  setActiveStatus,
  getStatusIcon,
  getStatusVariant,
  formatDate,
  getTotalPrice
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Orders</h1>
          <p className="text-muted-foreground">Manage and track your active orders in real-time</p>
        </div>
        <Button
          onClick={fetchLiveOrders}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveOrders?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveOrders?.filter(order => order.status === 'Pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalPrice(liveOrders).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From active orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as OrderItemStatus | 'All')}>
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-9 mb-6">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Confirm">Confirmed</TabsTrigger>
          <TabsTrigger value="Preparing">Preparing</TabsTrigger>
          <TabsTrigger value="Ready">Ready</TabsTrigger>
        </TabsList>

        <div className="mt-0">
          {filteredOrders && filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.order.id.slice(-6)}
                          {/* ✅ Updated to use table_number instead of table_id for display */}
                          {order.order.table_number && ` • Table ${order.order.table_number}`}
                        </CardTitle>
                        <CardDescription>
                          {order.order.restaurant.name} • Placed at {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{order.menu_item?.name || 'Menu Item'}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(order.price * order.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${order.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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