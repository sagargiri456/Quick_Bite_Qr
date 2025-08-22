// src/components/menu/MenuItemCard.tsx
import Link from 'next/link';
import { MenuItem } from '@/types/menu';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: string;
  onDelete: () => void;
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl duration-300">
      {item.imageUrl && (
        <div className="relative w-full aspect-video">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-2 mb-5 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mb-5">
          <span className="text-2xl font-bold text-indigo-600">${item.price.toFixed(2)}</span>
        </div>
        <div className="flex space-x-3">
          <Link
            href={onEdit}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}