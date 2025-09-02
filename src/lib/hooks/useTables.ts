'use client';
import { useState, useEffect, useCallback } from "react";

export function useTables() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tables");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTables(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const addTable = async (table: { table_number: string; qr_code_url: string; restaurant_id: string }) => {
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(table),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchTables(); // refresh
  };

  const deleteTable = async (id: number) => {
    const res = await fetch("/api/tables", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchTables(); // refresh
  };

  return { tables, loading, error, addTable, deleteTable, refetch: fetchTables };
}
