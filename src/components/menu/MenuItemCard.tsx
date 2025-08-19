// src/components/menu/MenuItemCard.tsx
import Link from 'next/link';
import { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: string;
  onDelete: () => void;
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'starters': return 'bg-blue-100 text-blue-800';
      case 'mains': return 'bg-orange-100 text-orange-800';
      case 'desserts': return 'bg-pink-100 text-pink-800';
      case 'drinks': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
        </div>
        <p className="text-gray-600 mb-5 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mb-5">
          <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
          {item.popular && (
            <span className="inline-flex items-center text-sm font-medium text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Popular
            </span>
          )}
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