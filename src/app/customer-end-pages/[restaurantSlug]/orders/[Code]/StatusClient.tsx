'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';
import StatusBadge from '@/components/orders/StatusBadge';
import ETA from '@/components/orders/ETA';
import FormattedDate from '@/components/FormattedDate';
import { registerPushForOrder } from '@/lib/utils/notifications'; // 1. Import the notification utility

// Defines the props this component receives from the page
type StatusClientProps = {
  trackCode: string;
  restaurantName: string;
  orderId: string; // 2. Ensure orderId is received for the subscription
  initialStatus: string;
  initialEta: number | null;
  createdAt: string;
};

const dbToUiStatus = (dbStatus: string): 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Complete' | 'Cancelled' => {
  const statusMap = {
    pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
    ready: 'Ready', complete: 'Complete', cancelled: 'Cancelled',
  } as const;
  return statusMap[dbStatus as keyof typeof statusMap] || 'Pending';
};

export default function StatusClient({
  trackCode,
  restaurantName,
  orderId, // Receive orderId
  initialStatus,
  initialEta,
  createdAt,
}: StatusClientProps) {
  const [status, setStatus] = useState(dbToUiStatus(initialStatus));
  const [eta, setEta] = useState<number | null>(initialEta);

  // 3. ADD THIS EFFECT TO TRIGGER PUSH SUBSCRIPTION
  useEffect(() => {
    // When the component first loads, ask for permission and register
    // for push notifications for this specific order.
    registerPushForOrder(orderId);
  }, [orderId]);

  // This effect handles real-time page updates via Supabase channels
  useEffect(() => {
    const channel = supabase
      .channel(`order-${trackCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', schema: 'public', table: 'orders',
          filter: `track_code=eq.${trackCode}`,
        },
        (payload) => {
          const row = payload.new as any;
          if (row?.status) setStatus(dbToUiStatus(row.status));
          if ('estimated_time' in row) setEta(row.estimated_time);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [trackCode]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Status</h1>
            <p className="text-gray-600">Track your order in real-time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Tracking Code</span>
                <p className="text-lg font-semibold text-gray-900">{trackCode}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Restaurant</span>
                <p className="text-lg font-semibold text-gray-900 capitalize">{restaurantName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Order Placed</span>
                <p className="text-lg font-semibold text-gray-900">
                  <FormattedDate dateString={createdAt} />
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={status} />
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Estimated Time</span>
                <ETA
                  currentStatus={status}
                  etaMinutes={eta}
                />
              </div>
            </div>
          </div>
          <OrderStatusTimeline currentStatus={status} />
        </div>
      </div>
    </div>
  );
}