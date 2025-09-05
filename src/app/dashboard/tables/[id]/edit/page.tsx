// src/app/dashboard/tables/[id]/edit/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Table {
    id: string;
    table_number: string;
}

export default function EditTablePage() {
    const router = useRouter();
    const params = useParams();
    const tableId = params.id as string;

    const [table, setTable] = useState<Table | null>(null);
    const [tableNumber, setTableNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!tableId) return;

        const fetchTable = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('tables')
                .select('id, table_number')
                .eq('id', tableId)
                .single();

            if (error || !data) {
                toast.error('Could not find the specified table.');
                router.push('/dashboard/tables');
            } else {
                setTable(data as Table);
                setTableNumber(data.table_number);
            }
            setLoading(false);
        };

        fetchTable();
    }, [tableId, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!tableNumber.trim()) {
            toast.error("Table name cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('tables')
                .update({ table_number: tableNumber })
                .eq('id', tableId);

            if (error) throw error;

            toast.success('Table updated successfully!');
            router.push('/dashboard/tables');
            router.refresh(); // Tell Next.js to refresh server components
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Update failed';
            toast.error(`Update failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            </div>
        );
    }
    
    if (!table) return null;

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
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Patio Table 4 or 12"
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
                            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}