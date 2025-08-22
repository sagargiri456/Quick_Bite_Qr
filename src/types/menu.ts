// src/types/menu.ts (example)

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  popular: boolean;
  imageUrl?: string; // Add this field, make it optional
}