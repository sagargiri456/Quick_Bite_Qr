'use client';

import { useState, useEffect, useCallback } from 'react';
import * as menuApi from '@/lib/api/menu';
import { MenuItem } from '@/types/menu';

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getMenuItems();
      setMenuItems(data);
    } catch {
      setError('Could not load menu. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  /**
   * Adds a new menu item for a specific restaurant.
   * @param newItemData The data from the form (name, price, etc.).
   * @param restaurantId The UUID of the restaurant this item belongs to.
   */
  const addMenuItem = async (newItemData: Omit<menuApi.NewMenuItem, 'restaurant_id'>, restaurantId: string) => {
    try {
      // Combine the form data with the restaurant ID to create a complete object
      const completeItemData = { ...newItemData, restaurant_id: restaurantId };
      const newItem = await menuApi.addMenuItem(completeItemData);
      setMenuItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error("Failed to add item:", err);
      throw err; // Re-throw the error for the page to handle
    }
  };

  const updateMenuItem = async (id: number, updatedItemData: Partial<MenuItem>) => {
    try {
      const updatedItem = await menuApi.updateMenuItem(id, updatedItemData);
      setMenuItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
    } catch (err) {
      console.error("Failed to update item:", err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: number) => {
    try {
      await menuApi.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return { menuItems, loading, error, addMenuItem, updateMenuItem, deleteMenuItem };
}
