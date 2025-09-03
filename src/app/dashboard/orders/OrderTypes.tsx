// src/app/dashboard/orders/OrderTypes.ts

// These are the types that match the data coming from your API
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "complete" | "cancelled";

// Represents a single item within an order
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  // This shape depends on your Supabase select query, adjust if needed
  menu_items: { 
    name: string;
  } | null;
}

// Represents a full order, which contains multiple items
export interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  track_code: string;
  total_amount: number;
  // These come from the joins in your API route
  tables: {
    table_number: string;
  } | null;
  restaurants: {
    restaurant_name: string;
  } | null;
  order_items: OrderItem[];
}