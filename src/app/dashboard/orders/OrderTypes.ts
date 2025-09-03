// src/app/dashboard/orders/OrderTypes.ts

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menu_items: {
    name: string;
  } | null;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  track_code: string;
  order_items: OrderItem[];
  restaurants: {
    restaurant_name: string;
    slug: string;
  } | null;
  tables: {
    table_number: string;
  } | null;
};