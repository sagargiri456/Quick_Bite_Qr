// src/app/dashboard/tables/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Save } from 'lucide-react';
import { Table } from '@/lib/api/tables';

export default function EditTablePage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [table, setTable] = useState<Table | null>(null);
  const [tableIdentifier, setTableIdentifier] = useState<string>('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchTable = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching table data:', error);
        alert('Could not find the table to edit.');
        router.push('/dashboard/tables');
      } else {
        setTable(data);
        setTableIdentifier(data.table_number);
      }
      setLoading(false);
    };

    fetchTable();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!table || !tableIdentifier.trim()) {
      alert("Table data is missing or table name is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tables')
        .update({ table_number: tableIdentifier })
        .eq('id', table.id);

      if (error) throw error;

      alert(`Successfully updated table!`);
      router.push('/dashboard/tables');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to update table: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!table) return <p className="text-red-600">Table not found.</p>;

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Table</h1>
          <p className="text-gray-600 mt-1">Update the name or number for this table.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label htmlFor="tableIdentifier" className="block text-lg font-semibold text-gray-700 mb-2">
              Table Name or Number
            </label>
            <input
              id="tableIdentifier"
              type="text"
              value={tableIdentifier}
              onChange={(e) => setTableIdentifier(e.target.value)}
              className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}