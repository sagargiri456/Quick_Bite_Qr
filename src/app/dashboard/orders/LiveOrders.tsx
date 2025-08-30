'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LiveOrdersComponent from '@/components/LiveOrdersComponent';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

export type OrderItemStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Cancelled';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  status: OrderItemStatus | null;
  created_at: string;
  order: {
    id: string;
    track_code: string | null;
    table_id: string | null;
    table_number: string | null;
    restaurant: { id: string; name: string; user_id: string };
  };
  menu_item: { id: string; name: string };
}

const LiveOrders = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [liveOrders, setLiveOrders] = useState<OrderItem[]>([]);
  const [restaurantIds, setRestaurantIds] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState<OrderItemStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  // ===== helpers =====
  const dbToUiStatus = (db: string | null): OrderItemStatus | null => {
    switch (db) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'cancelled': return 'Cancelled';
      default: return null;
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getTotalPrice = (orders: OrderItem[] | null) =>
    (orders ?? []).reduce((sum, o) => sum + o.price * o.quantity, 0);

  // ===== fetch all orders for restaurants owned by the logged-in user =====
  const fetchLiveOrders = async () => {
    setRefreshing(true);
    try {
      // 1) current user
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error('Not authenticated');

      // 2) restaurants owned by this user
      const { data: restaurants, error: restErr } = await supabase
        .from('restaurants')
        .select('id, restaurant_name, user_id')
        .eq('user_id', user.id);

      if (restErr) throw restErr;

      const ids = (restaurants ?? []).map(r => r.id);
      setRestaurantIds(ids);

      if (ids.length === 0) {
        setLiveOrders([]);
        setErrorMsg('⚠️ No restaurants found for your account.');
        return;
      }

      // 3) orders that belong only to those restaurants
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, track_code, status, created_at,
          table:tables ( id, table_number ),
          restaurant:restaurants ( id, restaurant_name, user_id ),
          order_items (
            id, quantity, price,
            menu_item:menu_items ( id, name )
          )
        `)
        .in('restaurant_id', ids)
        .in('status', ['pending','confirmed','preparing','ready','cancelled'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 4) normalize → one card per order item
      const normalized: OrderItem[] = (data || []).flatMap((order: any) =>
        (order.order_items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          status: dbToUiStatus(order.status),
          created_at: order.created_at,
          order: {
            id: order.id,
            track_code: order.track_code ?? null,
            table_id: order.table?.id ? String(order.table.id) : null,
            table_number: order.table?.table_number ?? null,
            restaurant: {
              id: order.restaurant?.id ?? '',
              name: order.restaurant?.restaurant_name ?? '',
              user_id: order.restaurant?.user_id ?? '',
            },
          },
          menu_item: {
            id: item.menu_item?.id ?? '',
            name: item.menu_item?.name ?? '',
          },
        }))
      );

      setLiveOrders(normalized);
      setErrorMsg(null);
    } catch (e: any) {
      console.error('[LiveOrders.fetch]', e);
      setErrorMsg(e?.message || 'Failed to load orders');
      setLiveOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // initial load
  useEffect(() => { fetchLiveOrders(); }, []);

  // realtime: refresh when any order changes for the owner’s restaurants
  useEffect(() => {
    if (!restaurantIds.length) return;

    const channels = restaurantIds.map((rid) =>
      supabase
        .channel(`orders-${rid}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${rid}` },
          () => fetchLiveOrders()
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [restaurantIds]);

  // status + search filter
  const filteredOrders = useMemo(() => {
    let orders = [...liveOrders];

    if (activeStatus !== 'All') {
      orders = orders.filter((o) => o.status === activeStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      orders = orders.filter((o) =>
        (o.order.track_code || '').toLowerCase().includes(q) ||
        (o.order.table_number || '').toLowerCase().includes(q) ||
        (o.menu_item.name || '').toLowerCase().includes(q) ||
        (o.order.restaurant.name || '').toLowerCase().includes(q) ||
        (o.status || '').toLowerCase().includes(q)
      );
    }
    return orders;
  }, [liveOrders, activeStatus, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header + Search */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Live Orders</h2>
          {errorMsg && (
            <div className="mt-2 flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
        <Input
          placeholder="Search by track code, table, item, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <LiveOrdersComponent
        liveOrders={liveOrders}
        filteredOrders={filteredOrders}
        refreshing={refreshing}
        fetchLiveOrders={fetchLiveOrders}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        formatDate={formatDate}
        getTotalPrice={(orders) => getTotalPrice(orders)}
        errorMsg={errorMsg}
      />
    </div>
  );
};

export default LiveOrders;
