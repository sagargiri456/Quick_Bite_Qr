export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';

export interface MenuItem {
  id: number;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category?: MenuCategory;
  photo_url?: string;
  available: boolean;
  created_at?: string;
  updated_at?: string;
}
