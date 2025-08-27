'use client';

import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { Plus } from 'lucide-react';
// CORRECTED: Import from the new co-located path
import { useCartStore } from '../store/cartStore'; 

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

interface CustomerMenuItemCardProps {
  item: MenuItem;
}

export default function CustomerMenuItemCard({ item }: CustomerMenuItemCardProps) {
  const { addItem } = useCartStore();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-48 w-full">
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
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</p>
          <button 
            onClick={() => addItem(item)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}