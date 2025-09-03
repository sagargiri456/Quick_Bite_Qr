// src/app/customer-end-pages/[restaurantSlug]/[tableId]/MenuClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import CustomerMenuItemCard from '@/app/customer-end-pages/PublicPagesComponents/CustomerMenuItemCard';
import Cart from '@/app/customer-end-pages/PublicPagesComponents/Cart';
import { useCartStore } from '@/app/customer-end-pages/store/cartStore';
import { MenuItem as BaseMenuItem, MenuCategory } from '@/types/menu';
import { Restaurant } from '@/types/restaurant';
import { ShoppingCart, Search } from 'lucide-react';

interface MenuItem extends BaseMenuItem {
  category?: MenuCategory;
}

interface MenuClientProps {
    initialMenuItems: MenuItem[];
    restaurantDetails: Restaurant;
    tableId: string;
    restaurantSlug: string;
}

export default function MenuClient({
    initialMenuItems,
    restaurantDetails,
    tableId,
    restaurantSlug,
}: MenuClientProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCartStore();

  const filteredItems = useMemo(() => 
    initialMenuItems.filter(item =>
        item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [initialMenuItems, searchQuery]);

  const groupedMenu = useMemo(() => 
    filteredItems.reduce((acc, item) => {
      const category = item.category || 'mains';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<MenuCategory, MenuItem[]>)
  , [filteredItems]);

  const categoryOrder: MenuCategory[] = ['starters', 'mains', 'desserts', 'drinks'];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto pb-12">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {restaurantDetails.restaurant_name}
            </h1>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
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
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />
          </div>
        </header>

        <main className="p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-xl text-gray-600">
                {searchQuery
                  ? `No menu items found for "${searchQuery}".`
                  : "This restaurant's menu is not available right now."}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {categoryOrder.map(
                (category) =>
                  groupedMenu[category] &&
                  groupedMenu[category].length > 0 && (
                    <section key={category}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupedMenu[category].map((item) => (
                          <CustomerMenuItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  )
              )}
            </div>
          )}
        </main>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantId={restaurantDetails.id}
        tableId={tableId}
        restaurantSlug={restaurantSlug}
      />
    </div>
  );
}