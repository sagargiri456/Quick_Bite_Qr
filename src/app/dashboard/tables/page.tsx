'use client';

import Link from 'next/link';
import { useTables } from '@/lib/hooks/useTables';
import QrCodeDisplay from '@/components/tables/QrCodeDisplay';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function TablesPage() {
  const { tables, loading, deleteTable } = useTables();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Table Management</h1>
            <p className="text-gray-600 mt-1">Add, view, and manage your restaurant&apos;s tables and QR codes.</p>
          </div>
          <Link 
            href="/dashboard/tables/add" 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Add New Table
          </Link>
        </div>
        
        {tables.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">No tables found</h2>
              <p className="text-gray-500 mt-2">Get started by adding your first table to generate a QR code.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map(table => (
              <div key={table.id} className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">{table.table_number}</h2>
                {table.qr_code_url && table.qr_code_url !== 'generating...' ? (
                  <QrCodeDisplay url={table.qr_code_url} tableName={table.table_number} />
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-500">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                 <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <Link href={`/dashboard/tables/${table.id}/edit`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        <Edit size={14} />
                        Edit
                    </Link>
                    <button onClick={() => deleteTable(table.id)} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors">
                        <Trash2 size={14} />
                        Delete
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}