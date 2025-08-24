-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text,
  photo_url text,
  available boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT menu_items_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  menu_item uuid,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_menu_item_fkey FOREIGN KEY (menu_item) REFERENCES public.menu_items(id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  table_id uuid,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'served'::text, 'paid'::text])),
  total_amount numeric NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT orders_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id)
);
CREATE TABLE public.restaurants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  restaurant_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  upi_id text NOT NULL,
  logo_url text,
  qr_url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  user_id uuid NOT NULL,
  CONSTRAINT restaurants_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tables (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  table_number text NOT NULL,
  qr_code_url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tables_pkey PRIMARY KEY (id),
  CONSTRAINT tables_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);