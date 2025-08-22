'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types/menu';
// Import your new API functions
import * as menuApi from '@/lib/api/menu';

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API layer when the component mounts
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError('Could not load menu. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // CREATE operation using the API
  const addMenuItem = async (newItemData: Omit<MenuItem, 'id'>) => {
    try {
      const newItem = await menuApi.addMenuItem(newItemData);
      setMenuItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error("Failed to add item:", err);
      // Re-throw the error so the form can catch it and handle the UI
      throw err;
    }
  };

  // UPDATE operation using the API
  const updateMenuItem = async (id: number, updatedItemData: Partial<MenuItem>) => {
    try {
      const updatedItem = await menuApi.updateMenuItem(id, updatedItemData);
      setMenuItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
    } catch (err) {
      console.error("Failed to update item:", err);
      throw err;
    }
  };

  // DELETE operation using the API
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