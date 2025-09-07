'use client';

import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { Plus } from 'lucide-react';
// CORRECTED: Import from the new co-located path
import { useCartStore } from '../store/cartStore'; 

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

interface CustomerMenuItemCardProps {
  item: MenuItem;
}

export default function CustomerMenuItemCard({ item }: CustomerMenuItemCardProps) {
  const { addItem } = useCartStore();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-40 sm:h-48 w-full">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-gray-100 h-full w-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{item.name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 flex-grow line-clamp-3">{item.description}</p>
        <div className="flex justify-between items-center mt-3 sm:mt-4 gap-2">
          <p className="text-lg sm:text-xl font-bold text-gray-900">{formatPrice(item.price)}</p>
          <button 
            onClick={() => addItem(item)}
            className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}