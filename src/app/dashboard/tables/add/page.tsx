'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useTables } from '@/lib/hooks/useTables';
import { generateQR } from '@/lib/api/generateQR';
import {supabase} from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton';
import { getRestaurantBySlug } from "@/lib/api/public";

type Restaurant = {
  id: string;
  owner_name: string;
  restaurant_name: string;
  email: string;
  phone: string;
  address: string;
  upi_id: string;
  logo_url: string | null;
  qr_url: string;
  created_at: Date | null;
  user_id: string;
  slug: string;
};

export default function AddTablePage() {
  const [isSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const [loading,setLoading] = useState<boolean>(true);
  const [restaurant,setRestaurant] = useState<Restaurant | null>(null);
  const [tableNumber, setTableNumber] = useState<number>();
  const [url, setUrl] = useState<string>();
  
  useEffect(()=>{
      const fetchRestaurant = async() => {
        //getting the details of the current user form the supabase
        const {data:{user},error:authError} = await supabase.auth.getUser();
        if(authError || !user){
          setLoading(false)
          return
        }
        console.log("user is below"); 
        console.log(user)
        //getting the details of the restaurant using the user_id fetched above.
    const { data, error } = await supabase
      .from('restaurants') 
      .select('*')
      .eq('user_id', user.id)
      .single();
          if(error){
            console.log('error in fetching the restaurants data')
          }else{
            setRestaurant(data);
            setLoading(false);
            console.log(data);
          }
        }
        fetchRestaurant()
      },[]) 

      console.log(restaurant);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget; 
      const formData = new FormData(form);
      const tableNumberRaw = formData.get('tableNumber') as string;
      console.log(tableNumberRaw);
      const tableNumber = Number(tableNumberRaw);
      console.log(`table number is ${tableNumber}`)
      setTableNumber(tableNumber);
        const restaurantSlug= restaurant?.slug;
        const restaurantId = restaurant?.id;
        if(!restaurantSlug){
          console.log("error in gettintg the sllug.");
          return;
        }
        console.log(restaurantSlug)
        console.log(restaurantId);
    
        const createTable = async (restaurantId:string,tableNumber:number)=>{
        const qrUrl = await generateQR(restaurantSlug, tableNumber);
        console.log(qrUrl);
        setUrl(qrUrl);
        const { data, error } = await supabase.rpc("create_table_with_qr", {
        restaurant_uuid: restaurantId,
        table_num: tableNumber,
        qr_url: qrUrl,
    });
    if (error) throw error;
    console.log("Table created:", data);
      }
      if (restaurantId) {
        createTable(restaurantId, tableNumber);
      }
    };

const handleDownloadQR = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `table-${tableNumber}.png`;
  link.click();
};

  
    if(loading) return <Skeleton className="h-32 w-full" />
    // if (!restaurant) return <p className="text-black-500  ">No restaurant profile found.</p>
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
  id="tableNumber"
  type="text"
  name="tableNumber"
  value={tableNumber ?? ""}
  onChange={(e) => setTableNumber(Number(e.target.value))}
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
        {url && (
          <button
            onClick={() => handleDownloadQR(url)}
            className="mt-4 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
          >
            Download QR
          </button>
        )}
      </div>
    </div>
  );
}