// // src/app/dashboard/tables/add/page.tsx

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { generateQR } from '@/lib/api/generateQR';
// import { supabase } from '@/lib/supabase/client';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Loader2 } from 'lucide-react';
// import { Restaurant } from '@/types/restaurant'; // Using a shared type

// export default function AddTablePage() {
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   // FIX: Table identifier is a string, not just a number
//   const [tableIdentifier, setTableIdentifier] = useState<string>('');
//   const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         setLoading(false);
//         // Optionally, redirect to login
//         router.push('/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('restaurants')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (data) {
//         setRestaurant(data);
//       } else {
//         console.error('Error fetching restaurant data:', error);
//       }
//       setLoading(false);
//     };
//     fetchRestaurant();
//   }, [router]);

//   // FIX: Make the handler async and use state directly
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!restaurant || !tableIdentifier.trim()) {
//         alert("Restaurant data is missing or table name is empty.");
//         return;
//     }

//     setIsSubmitting(true);
//     setGeneratedUrl(null);

//     try {
//       // The API route calls the edge function to do all the work
//       const qrUrl = await generateQR(restaurant.id, tableIdentifier);
//       setGeneratedUrl(qrUrl);
//       alert(`Successfully created table "${tableIdentifier}"!`);
//       // You can now download the QR or navigate away
//       router.push('/dashboard/tables');
//     } catch (error: any) {
//       console.error(error);
//       alert(`Failed to create table: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDownloadQR = () => {
//     if (!generatedUrl) return;
//     const link = document.createElement("a");
//     link.href = generatedUrl;
//     link.download = `table-${tableIdentifier.replace(/\s+/g, '-')}.png`;
//     link.click();
//   };

//   if (loading) return <Skeleton className="h-64 w-full" />;
//   if (!restaurant) return <p className="text-red-600">No restaurant profile found.</p>;

//   return (
//     <div className="p-4 sm:p-8">
//       <div className="max-w-lg mx-auto">
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center">
//           <button
//             onClick={() => router.back()}
//             className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 mr-4"
//             aria-label="Go back"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Add New Table</h1>
//             <p className="text-gray-600 mt-1">Create a new table and generate its QR code.</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
//           <div>
//             <label htmlFor="tableIdentifier" className="block text-lg font-semibold text-gray-700 mb-2">
//               Table Name or Number
//             </label>
//             <input
//               id="tableIdentifier"
//               type="text"
//               name="tableIdentifier"
//               value={tableIdentifier}
//               onChange={(e) => setTableIdentifier(e.target.value)}
//               className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="e.g., Patio Table 4 or 12"
//               required
//             />
//           </div>
//           <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center"
//             >
//               {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
//               {isSubmitting ? 'Saving...' : 'Save Table'}
//             </button>
//           </div>
//         </form>

//         {generatedUrl && (
//           <div className="mt-8 bg-white p-6 rounded-2xl shadow-md text-center">
//             <h3 className="text-lg font-semibold mb-4">QR Code Generated!</h3>
//             <img src={generatedUrl} alt="Generated QR Code" className="mx-auto h-40 w-40" />
//             <button
//               onClick={handleDownloadQR}
//               className="mt-4 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
//             >
//               Download QR
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useTables } from '@/lib/hooks/useTables';
import { generateQR } from '@/lib/api/generateQR';
import {supabase} from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton';
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


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget; 
      const formData = new FormData(form);
      const tableNumberRaw = formData.get('tableNumber') as string;
      console.log(tableNumberRaw);
      const tableNumber = Number(tableNumberRaw);
      console.log(`table number is ${tableNumber}`)
      setTableNumber(tableNumber);

        const restaurantId = restaurant?.id;
        console.log(restaurantId);
    
        const createTable = async (restaurantId:string,tableNumber:number)=>{
        const qrUrl = await generateQR(restaurantId, tableNumber);
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