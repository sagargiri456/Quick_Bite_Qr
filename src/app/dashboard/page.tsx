'use client';

import { useMenuItems } from '@/lib/hooks/useMenuItems';
// import { useTables } from '@/lib/hooks/useTables';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { UtensilsCrossed, SquareKanban, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, loading }: { title: string, value: number, icon: React.ElementType, loading: boolean }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="bg-indigo-100 p-4 rounded-xl">
      <Icon className="h-8 w-8 text-indigo-600" />
    </div>
    <div>
      <p className="text-lg text-gray-600">{title}</p>
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      ) : (
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default function DashboardHomePage() {
  const { loading: authLoading } = useProtectedRoute();
  const { menuItems, loading: menuLoading } = useMenuItems();
  // const { tables, loading: tablesLoading } = useTables();

  // You would fetch the real restaurant name after setting up user profiles
  const restaurantName = "Your Restaurant"; 

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to {restaurantName}!</h1>
        <p className="text-gray-600 mt-2 text-lg">Here's a summary of your restaurant's activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Menu Items" 
          value={menuItems.length} 
          icon={UtensilsCrossed} 
          loading={menuLoading} 
        />
        {/*<StatCard 
          title="Total Tables" 
          value={tables.length} 
          icon={SquareKanban} 
          loading={tablesLoading} 
        />*/}
      </div>
    </div>
  );
}
