// src/lib/hooks/useMenus.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { getMenus, Menu } from '@/lib/api/menus';

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return { menus, loading, error, refetch: fetchMenus };
}