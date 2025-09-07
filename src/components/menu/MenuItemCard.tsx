import Image from 'next/image';
import Link from 'next/link';
import { MenuItem } from '@/types/menu'; // Ensure this path is correct

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: string;
  onDelete: () => void;
}

// Helper to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 w-full bg-gray-100">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder for items without an image
          <div className="flex items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{item.name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 h-8 sm:h-10 overflow-hidden line-clamp-2">{item.description}</p>
        <p className="text-lg sm:text-xl font-bold text-indigo-600 mt-2 sm:mt-3">{formatPrice(item.price)}</p>
      </div>

      {/* Actions Section */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t flex justify-end gap-1.5 sm:gap-2">
        <Link href={onEdit} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
