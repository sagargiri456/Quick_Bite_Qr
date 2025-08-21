'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTables } from '@/lib/hooks/useTables';

export default function AddTablePage() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTable } = useTables();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTable(name);
      router.push('/dashboard/tables');
    } catch (error) {
      console.error("Failed to add table", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center">
            {/* This is the blue back button */}
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors mr-4"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Table</h1>
              <p className="text-gray-600 mt-1">Create a new table and generate its QR code.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              Table Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-all"
              placeholder="e.g., Patio Table 4"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
              >
                  Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                  {isSubmitting ? 'Saving...' : 'Save Table'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}