'use client';

import { useState, useEffect } from 'react';
import { getPublicMenuItems, getRestaurantDetails } from '@/lib/api/public';
import CustomerMenuItemCard from '@/app/customer-end-pages/PublicPagesComponents/CustomerMenuItemCard';
import Cart from '@/app/customer-end-pages/PublicPagesComponents/Cart';
import { useCartStore } from '@/app/customer-end-pages/store/cartStore';
import { MenuItem as BaseMenuItem, MenuCategory } from '@/types/menu';
import { ShoppingCart, Search, Loader2 } from 'lucide-react';

// Define a type for the restaurant details we expect to fetch
interface RestaurantDetails {
  id: string;
  restaurant_name: string;
}

// Define a local MenuItem type that includes the 'category' property used for grouping
interface MenuItem extends BaseMenuItem {
    category?: MenuCategory;
}

export default function CustomerMenuPage({ params }: { params: { restaurantSlug: string, tableId: string } }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCartStore();

  useEffect(() => {
    // FIX: Access params properties only inside the useEffect hook to avoid the warning.
    const { restaurantSlug } = params;

    const fetchData = async () => {
      if (!restaurantSlug) return; // Guard against running with no slug

      setIsLoading(true);
      try {
        const [items, details] = await Promise.all([
          getPublicMenuItems(restaurantSlug),
          getRestaurantDetails(restaurantSlug)
        ]);
        
        setMenuItems(items || []); // Ensure menuItems is always an array

        if (details) {
          setRestaurantDetails(details);
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // FIX: The dependency should be the entire params object.
  }, [params]);

  const groupedMenu = menuItems.reduce((acc, item) => {
    const category = item.category || 'mains';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);


  const categoryOrder: MenuCategory[] = ['starters', 'mains', 'desserts', 'drinks'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto pb-12">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {restaurantDetails ? restaurantDetails.restaurant_name : 'Menu'}
            </h1>
            <button onClick={() => setIsCartOpen(true)} className="relative bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
              <ShoppingCart size={20} />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </header>

        <main className="p-4">
          {!restaurantDetails || menuItems.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-xl text-gray-600">This restaurant's menu is not available right now.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categoryOrder.map(category => (
                groupedMenu[category] && groupedMenu[category].length > 0 && (
                  <section key={category}>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedMenu[category].map(item => (
                        <CustomerMenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                )
              ))}
            </div>
          )}
        </main>
      </div>
      
      {restaurantDetails && (
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          restaurantId={restaurantDetails.id}
          tableId={params.tableId}
        />
      )}
    </div>
  );
}