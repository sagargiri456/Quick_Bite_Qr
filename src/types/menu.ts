export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  photo_url?: string;
  // ADDED: Make sure this property exists
  available: boolean; 
}
