// src/app/dashboard/orders/page.tsx
import React from 'react';
import LiveOrders from './LiveOrders';
import OrderHistory from './OrderHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Orders() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Monitor live orders and browse historical activity.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Live Orders */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Live Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Make inner content scroll on small screens while keeping the card tidy */}
            <div className="max-h-[70vh] overflow-auto px-4 pb-4">
              <LiveOrders />
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-auto px-4 pb-4">
              <OrderHistory />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
