// src/types/menu.ts
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  popular: boolean;
  image?: string;
}

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';