'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';
import StatusBadge from '@/components/orders/StatusBadge';
import ETA from '@/components/orders/ETA';
import { registerPushForOrder } from '@/lib/utils/notifications';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReceiptText, ShoppingBag, Clock, DollarSign } from 'lucide-react';

// Define a type for the items with details
type OrderItemWithDetails = {
  quantity: number;
  price: number;
  menu_items: { name: string } | null;
};

// Defines the props this component receives from the page
type StatusClientProps = {
  initialOrder: {
    id: string;
    trackCode: string;
    status: string;
    eta: number | null;
    createdAt: string;
    totalAmount: number;
    items: OrderItemWithDetails[];
  };
  restaurant: {
    name: string;
    logoUrl: string | null;
  };
};

const dbToUiStatus = (dbStatus: string): 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Complete' | 'Cancelled' => {
  const statusMap = {
    pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
    ready: 'Ready', complete: 'Complete', cancelled: 'Cancelled',
  } as const;
  return statusMap[dbStatus as keyof typeof statusMap] || 'Pending';
};

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Helper to format date and time nicely
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export default function StatusClient({ initialOrder, restaurant }: StatusClientProps) {
  const [status, setStatus] = useState(dbToUiStatus(initialOrder.status));
  const [eta, setEta] = useState<number | null>(initialOrder.eta);

  useEffect(() => {
    registerPushForOrder(initialOrder.id);
  }, [initialOrder.id]);

  // Real-time subscription for status and ETA updates
  useEffect(() => {
    const channel = supabase
      .channel(`order-${initialOrder.trackCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `track_code=eq.${initialOrder.trackCode}` },
        (payload) => {
          const row = payload.new as any;
          if (row?.status) setStatus(dbToUiStatus(row.status));
          if ('estimated_time' in row) setEta(row.estimated_time);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [initialOrder.trackCode]);

  // This effect polls for updates as a backup
  useEffect(() => {
    const pollOrderStatus = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status, estimated_time')
        .eq('track_code', initialOrder.trackCode)
        .single();

      if (error) {
        console.warn('Polling for order status failed:', error.message);
        return;
      }

      if (data) {
        setStatus(dbToUiStatus(data.status));
        setEta(data.estimated_time);
      }
    };

    const intervalId = setInterval(pollOrderStatus, 5000); // 5000 ms = 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [initialOrder.trackCode]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                <AvatarImage src={restaurant.logoUrl || ''} alt={restaurant.name} />
                <AvatarFallback className="text-xl bg-gray-200 text-gray-700">
                    {getInitials(restaurant.name)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-gray-600">Order Status</p>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
            <div className="flex items-start gap-3">
                <ReceiptText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="font-medium text-gray-500">Tracking Code</span>
                    <p className="text-base font-semibold text-gray-900 font-mono">{initialOrder.trackCode}</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="font-medium text-gray-500">Order Placed</span>
                    <p className="text-base font-semibold text-gray-900">{formatDateTime(initialOrder.createdAt)}</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="font-medium text-gray-500">Total Amount</span>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(initialOrder.totalAmount)}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <ShoppingBag className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="font-medium text-gray-500">Current Status</span>
                    <div className="mt-1">
                        <StatusBadge status={status} />
                    </div>
                </div>
            </div>
          </div>
          <Separator className="my-6" />

          {/* Order Items Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Order</h2>
            <ul className="space-y-3">
              {initialOrder.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-xs font-bold text-gray-600 mr-3">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700">{item.menu_items?.name || 'Unknown Item'}</span>
                  </div>
                  <span className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Progress</h2>
            <div className="text-right">
                {/* ✅ THIS IS THE CORRECTED LINE */}
                <span className="text-sm font-medium text-gray-500">Estimated Time</span>
                <ETA currentStatus={status} etaMinutes={eta} />
            </div>
          </div>
          <OrderStatusTimeline currentStatus={status} />
        </div>
      </div>
    </div>
  );
}