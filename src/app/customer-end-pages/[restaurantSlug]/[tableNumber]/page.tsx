'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPublicMenuItems, getRestaurantDetails } from '@/lib/api/public';
import CustomerMenuItemCard from '@/app/customer-end-pages/PublicPagesComponents/CustomerMenuItemCard';
import Cart from '@/app/customer-end-pages/PublicPagesComponents/Cart';
import { useCartStore } from '@/app/customer-end-pages/store/cartStore';
import { MenuItem as BaseMenuItem, MenuCategory } from '@/types/menu';
import { ShoppingCart, Search, Loader2, AlertTriangle } from 'lucide-react';

interface RestaurantDetails {
  id: string;
  restaurant_name: string;
}
interface MenuItem extends BaseMenuItem {
  category?: MenuCategory;
}

export default function CustomerMenuPage() {
  const params = useParams<{ restaurantSlug: string; tableNumber: string }>();
  const { restaurantSlug, tableNumber } = params;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCartStore();

  useEffect(() => {
    if (!restaurantSlug || !tableNumber) {
        setError("Missing restaurant or table information in the URL.");
        setIsLoading(false);
        return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await getRestaurantDetails(restaurantSlug);
        if (!details) {
          throw new Error(`Could not find a restaurant with the slug: "${restaurantSlug}"`);
        }
        setRestaurantDetails(details);
        const items = await getPublicMenuItems(restaurantSlug);
        setMenuItems(items || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while loading the menu.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [restaurantSlug, tableNumber]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-red-700">Error Loading Page</h1>
                <p className="text-gray-700 mt-2">{error}</p>
            </div>
        </div>
    );
  }

  const filteredItems = menuItems.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMenu = filteredItems.reduce((acc, item) => {
    const category = (item.category as MenuCategory) || 'mains';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  const categoryOrder: MenuCategory[] = ['starters', 'mains', 'desserts', 'drinks'];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto pb-12">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {restaurantDetails ? restaurantDetails.restaurant_name : 'Menu'}
            </h1>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </header>
        <main className="p-4">
          {!restaurantDetails || menuItems.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-xl text-gray-600">This restaurant&apos;s menu is not available right now.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categoryOrder.map(
                (category) =>
                  groupedMenu[category] && groupedMenu[category].length > 0 && (
                    <section key={category}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupedMenu[category].map((item) => <CustomerMenuItemCard key={item.id} item={item} />)}
                      </div>
                    </section>
                  )
              )}
            </div>
          )}
        </main>
      </div>

      {restaurantDetails && restaurantDetails.id && tableNumber && restaurantSlug && (
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          restaurantId={restaurantDetails.id}
          tableNumber={tableNumber}
          restaurantSlug={restaurantSlug}
        />
      )}
    </div>
  );
}