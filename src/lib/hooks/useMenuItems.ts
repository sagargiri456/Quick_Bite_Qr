// src/lib/hooks/useMenuItems.ts
'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '@/types/menu';

// Mock data - in a real app, you'd fetch from your API
const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 5.99,
    category: "starters",
    popular: true
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, and basil",
    price: 7.99,
    category: "starters",
    popular: true
  },
  {
    id: 3,
    name: "Calamari",
    description: "Crispy fried squid served with marinara sauce",
    price: 10.99,
    category: "starters",
    popular: false
  },
  {
    id: 4,
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
    price: 8.99,
    category: "starters",
    popular: false
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    description: "Classic pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "mains",
    popular: true
  },
  {
    id: 6,
    name: "Margherita Pizza",
    description: "Tomato sauce, fresh mozzarella, and basil on thin crust",
    price: 12.99,
    category: "mains",
    popular: true
  },
  {
    id: 7,
    name: "Chicken Parmesan",
    description: "Breaded chicken topped with marinara and melted cheese, served with pasta",
    price: 16.99,
    category: "mains",
    popular: true
  },
  {
    id: 8,
    name: "Lasagna",
    description: "Layers of pasta, beef, cheese, and tomato sauce baked to perfection",
    price: 15.99,
    category: "mains",
    popular: false
  },
  {
    id: 9,
    name: "Tiramisu",
    description: "Coffee-flavored Italian dessert with mascarpone and cocoa",
    price: 7.99,
    category: "desserts",
    popular: true
  },
  {
    id: 10,
    name: "Panna Cotta",
    description: "Silky cooked cream dessert with berry compote",
    price: 6.99,
    category: "desserts",
    popular: false
  },
  {
    id: 11,
    name: "Chocolate Gelato",
    description: "Rich Italian-style chocolate ice cream",
    price: 5.99,
    category: "desserts",
    popular: true
  },
  {
    id: 12,
    name: "Cannoli",
    description: "Crispy pastry tubes filled with sweet ricotta cream",
    price: 6.99,
    category: "desserts",
    popular: false
  },
  {
    id: 13,
    name: "Italian Red Wine",
    description: "House red wine from Tuscany",
    price: 8.99,
    category: "drinks",
    popular: true
  },
  {
    id: 14,
    name: "Craft Beer",
    description: "Local IPA with citrus notes",
    price: 6.99,
    category: "drinks",
    popular: false
  },
  {
    id: 15,
    name: "Limoncello Spritz",
    description: "Refreshing lemon liqueur with prosecco and soda",
    price: 9.99,
    category: "drinks",
    popular: true
  },
  {
    id: 16,
    name: "Espresso",
    description: "Strong Italian-style coffee",
    price: 3.99,
    category: "drinks",
    popular: true
  }
];

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMenuItems(initialMenuItems);
      setLoading(false);
    }, 500);
  }, []);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Math.max(0, ...menuItems.map(i => i.id)) + 1,
    };
    setMenuItems([...menuItems, newItem]);
    return Promise.resolve(newItem);
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    return Promise.resolve();
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    return Promise.resolve();
  };

  const getMenuItemsByCategory = (category: MenuCategory) => {
    return menuItems.filter(item => item.category === category);
  };

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemsByCategory
  };
}