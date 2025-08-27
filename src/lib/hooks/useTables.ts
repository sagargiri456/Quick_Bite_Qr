'use client';

import { useState, useEffect, useCallback } from 'react';
import * as tableApi from '@/lib/api/tables';
import { supabase } from '@/lib/supabase/client'; // Import the Supabase client

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

  // This function now calls your Edge Function to create the table and QR code
  const addTable = async (name: string, restaurantId: string) => {
    // CORRECTED: The function name is 'generate-table-qr'
    const { data: newTable, error } = await supabase.functions.invoke('generate-table-qr', {
      body: { restaurantId, tableNumber: name },
    });

    if (error) {
      console.error("Error calling generate-table-qr Edge Function:", error);
      throw error;
    }

    // Update the local state with the new table returned from the function
    setTables(prev => [...prev, newTable]);
    return newTable;
  };

  const deleteTable = async (id: number) => {
    await tableApi.deleteTable(id);
    setTables(prev => prev.filter(table => table.id !== id));
  };

  return { tables, loading, addTable, deleteTable };
}