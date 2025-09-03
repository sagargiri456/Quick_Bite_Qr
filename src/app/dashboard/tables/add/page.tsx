'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateQR } from '@/lib/api/generateQR';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import QrCodeDisplay from '@/components/tables/QrCodeDisplay';
import { Restaurant } from '@/types/restaurant'; // Import the type

export default function AddTablePage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tableIdentifier, setTableIdentifier] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setRestaurant(data);
      } else {
        console.error('Error fetching restaurant data:', error);
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!restaurant || !tableIdentifier.trim()) {
      alert("Restaurant data is missing or table name is empty.");
      return;
    }

    setIsSubmitting(true);
    setGeneratedUrl(null);
    setShowQRCode(false);

    try {
      const qrUrl = await generateQR(restaurant.id, tableIdentifier);
      setGeneratedUrl(qrUrl);
      setShowQRCode(true); // Show the QR code section on success
    } catch (error: any) {
      console.error(error);
      // FIXED: Corrected template literal for the alert message
      alert(`Failed to create table: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!restaurant) return <p className="text-red-600">No restaurant profile found.</p>;

  // If a QR code has been generated, show the success view
  if (showQRCode && generatedUrl) {
    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-lg mx-auto text-center">
                 <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
                   <h3 className="text-2xl font-bold mb-4 text-green-600">Success!</h3>
                   <p className="text-gray-600 mb-4">Your QR code for table "{tableIdentifier}" is ready.</p>
                   <QrCodeDisplay
                     url={generatedUrl}
                     tableName={tableIdentifier}
                   />
                   <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                     <button
                       onClick={() => {
                         setShowQRCode(false);
                         setTableIdentifier('');
                         setGeneratedUrl(null);
                       }}
                       className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                     >
                       Add Another Table
                     </button>
                     <button
                       onClick={() => router.push('/dashboard/tables')}
                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                     >
                       View All Tables
                     </button>
                   </div>
                 </div>
            </div>
        </div>
    );
  }

  // Default view: Show the form to add a table
  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 mr-4"
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
            <label htmlFor="tableIdentifier" className="block text-lg font-semibold text-gray-700 mb-2">
              Table Name or Number
            </label>
            <input
              id="tableIdentifier"
              type="text"
              name="tableIdentifier"
              value={tableIdentifier}
              onChange={(e) => setTableIdentifier(e.target.value)}
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
              {isSubmitting ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}