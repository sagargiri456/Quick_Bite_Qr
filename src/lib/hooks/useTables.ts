'use client';

import { useState, useEffect, useCallback } from 'react';
import * as tableApi from '@/lib/api/tables';

export function useTables() {
  const [tables, setTables] = useState<tableApi.Table[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tableApi.getTables();
      setTables(data);
    } catch (error) {
      console.error("Failed to fetch tables", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const addTable = async (name: string) => {
    const restaurantId = 'your-restaurant-id';
    
    // CHANGED: Use 'table_number' when creating the object
    const tempTable = await tableApi.addTable({ table_number: name, qr_code_url: 'generating...' });
    
    const finalUrl = `https://quickbiteqr.com/menu/${restaurantId}/table/${tempTable.id}`;
    
    const finalTable = await tableApi.updateTable(tempTable.id, { qr_code_url: finalUrl });
    
    setTables(prev => [...prev, finalTable]);
  };

  const deleteTable = async (id: number) => {
    await tableApi.deleteTable(id);
    setTables(prev => prev.filter(table => table.id !== id));
  };

  return { tables, loading, addTable, deleteTable };
}