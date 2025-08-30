// src/types/menu.ts

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  // FIX: The category is used in the app, so it should be part of the type.
  // Making it optional to handle cases where it might be null.
  category?: MenuCategory;
  photo_url?: string;
  available: boolean;
}