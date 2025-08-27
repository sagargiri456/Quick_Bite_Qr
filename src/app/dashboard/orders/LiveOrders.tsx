// 'use client'
// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase/client';
// import LiveOrdersComponent from '@/components/LiveOrdersComponent';
// import { Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';

// export type OrderItemStatus =
//   | 'Pending'
//   | 'Confirm'
//   | 'Preparing'
//   | 'Ready'
//   | 'Complete'
//   | 'Cancelled'
//   | 'Rejected'
//   | 'Refunded';

// // Export the interface so it can be reused
// export interface OrderItem {
//   id: string;
//   quantity: number;
//   price: number;
//   status: OrderItemStatus | null;
//   created_at: string;
//   order: {
//     id: string;
//     table_id: string | null;
//     table_number: string | null;
//     restaurant: {
//       id: string;
//       name: string;
//       user_id: string;
//     };
//   };
//   menu_item: {
//     id: string;
//     name: string;
//   };
// }

// const LiveOrders = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [liveOrders, setLiveOrders] = useState<OrderItem[] | null>(null);
//   const [filteredOrders, setFilteredOrders] = useState<OrderItem[] | null>(null);
//   const [activeStatus, setActiveStatus] = useState<OrderItemStatus | 'All'>('All');

//   useEffect(() => {
//     fetchLiveOrders();
//   }, []);

//   useEffect(() => {
//     if (activeStatus === 'All') {
//       setFilteredOrders(liveOrders);
//     } else {
//       setFilteredOrders(liveOrders?.filter(order => order.status === activeStatus) || null);
//     }
//   }, [liveOrders, activeStatus]);

//  const fetchLiveOrders = async () => {
//   setRefreshing(true);

//   const { data: { user }, error: authError } = await supabase.auth.getUser();

//   if (authError || !user) {
//     console.log("Restaurant owner not found!");
//     setLoading(false);
//     setRefreshing(false);
//     return;
//   }

//   const { data, error } = await supabase
//     .from('order_items')
//     .select(`
//       id,
//       quantity,
//       price,
//       status,
//       created_at,
//       order:orders (
//         id,
//         table_id,
//         table:tables(
//           id,
//           table_number
//         ),
//         restaurant:restaurants (
//           id,
//           restaurant_name,
//           owner_name,
//           user_id
//         )
//       ),
//       menu_item:menu_items (
//         id,
//         name
//       )
//     `)
//     .eq('order.restaurant.user_id', user.id)
//     .not('status', 'in', '(Complete,Rejected,Cancelled,Refunded)')
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.log('Error in fetching live orders', error);
//   } else {
//     // ✅ Fixed normalization with correct property mapping
//     const normalized: OrderItem[] = (data || []).map((item: any) => ({
//       id: item.id,
//       quantity: item.quantity,
//       price: item.price,
//       status: item.status,
//       created_at: item.created_at,
//       order: {
//         id: item.order?.id || '',
//         table_id: item.order?.table_id || null,
//         table_number: item.order?.table?.table_number || null,
//         restaurant: item.order?.restaurant ? {
//           id: item.order.restaurant.id,
//           name: item.order.restaurant.restaurant_name, // ✅ Fixed: use restaurant_name
//           user_id: item.order.restaurant.user_id,
//         } : { id: '', name: '', user_id: '' },
//       },
//       menu_item: {
//         id: item.menu_item?.id || '',
//         name: item.menu_item?.name || '',
//       }
//     }));

//     setLiveOrders(normalized);
//   }

//   setLoading(false);
//   setRefreshing(false);
// };

//   const getStatusIcon = (status: OrderItemStatus | null) => {
//     switch (status) {
//       case 'Pending': return <Clock className="h-4 w-4" />;
//       case 'Confirm': return <CheckCircle className="h-4 w-4" />;
//       case 'Preparing': return <ChefHat className="h-4 w-4" />;
//       case 'Ready': return <CheckCircle className="h-4 w-4" />;
//       case 'Cancelled':
//       case 'Rejected':
//       case 'Refunded': return <XCircle className="h-4 w-4" />;
//       default: return <Clock className="h-4 w-4" />;
//     }
//   };

//   const getStatusVariant = (status: OrderItemStatus | null) => {
//     switch (status) {
//       case 'Cancelled':
//       case 'Rejected':
//       case 'Refunded':
//         return 'destructive';
//       case 'Confirm':
//       case 'Preparing':
//       case 'Ready':
//         return 'default';
//       case 'Pending':
//       default:
//         return 'secondary';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const getTotalPrice = (orders: OrderItem[] | null) => {
//     if (!orders) return 0;
//     return orders.reduce((total, order) => total + (order.price * order.quantity), 0);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <LiveOrdersComponent
//       liveOrders={liveOrders}
//       filteredOrders={filteredOrders}
//       refreshing={refreshing}
//       fetchLiveOrders={fetchLiveOrders}
//       activeStatus={activeStatus}
//       setActiveStatus={setActiveStatus}
//       getStatusIcon={getStatusIcon}
//       getStatusVariant={getStatusVariant}
//       formatDate={formatDate}
//       getTotalPrice={getTotalPrice}
//     />
//   );
// };

// export default LiveOrders;