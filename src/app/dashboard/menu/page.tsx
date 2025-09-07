// src/app/dashboard/menu/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMenuItems } from '@/lib/hooks/useMenuItems';
import { MenuItem } from '@/types/menu';
import MenuItemCard from '@/components/menu/MenuItemCard';
import DeleteConfirmation from '@/components/menu/DeleteConfirmation';

export default function MenuPage() {
    const { menuItems, loading, error, deleteMenuItem } = useMenuItems();
    const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const searchedItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async () => {
        if (itemToDelete) {
            await deleteMenuItem(itemToDelete.id);
            setItemToDelete(null);
        }
    };
    const averagePrice = menuItems.length > 0
        ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)
        : '0.00';

    // **FIX**: The actual JSX for the loading state is now included.
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-8 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-indigo-800">Loading menu items...</p>
            </div>
        </div>
    );

    // **FIX**: The actual JSX for the error state is now included.
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Menu</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-2 sm:p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Menu Management</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your restaurant menu items</p>
                        </div>
                        <Link
                            href="/dashboard/menu/add"
                            className="flex items-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Add New Item
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
                    <div className="relative">
                        <input
                            type="text" placeholder="Search menu items..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 absolute left-3 sm:left-4 top-2.5 sm:top-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-6 lg:mb-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 flex items-center">
                        <div className="rounded-xl bg-indigo-100 p-2.5 sm:p-3 mr-3 sm:mr-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                        <div><p className="text-xs sm:text-sm text-gray-500">Total Items</p><p className="text-xl sm:text-2xl font-bold text-gray-800">{menuItems.length}</p></div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 flex items-center">
                        <div className="rounded-xl bg-emerald-100 p-2.5 sm:p-3 mr-3 sm:mr-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <div><p className="text-xs sm:text-sm text-gray-500">Avg. Price</p><p className="text-xl sm:text-2xl font-bold text-gray-800">₹{averagePrice}</p></div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Menu Items</h2>
                        <p className="text-sm sm:text-base text-gray-600">Showing {searchedItems.length} of {menuItems.length} items</p>
                    </div>
                    {searchedItems.length === 0 ? (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-8 sm:p-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">No menu items found</h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">{searchQuery ? 'Try a different search term' : 'Get started by adding your first menu item'}</p>
                            <Link href="/dashboard/menu/add" className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all text-sm sm:text-base"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> Add New Item</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {searchedItems.map(item => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    onEdit={`/dashboard/menu/${item.id}/edit`}
                                    onDelete={() => setItemToDelete(item)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmation
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                itemName={itemToDelete?.name || ''}
            />
        </div>
    );
}