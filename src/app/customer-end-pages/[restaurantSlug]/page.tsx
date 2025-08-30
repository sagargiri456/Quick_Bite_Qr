// src/app/customer-end-pages/[restaurantSlug]/page.tsx

import { getRestaurantBySlug } from "@/lib/api/public";
import { Scan } from 'lucide-react';
import Link from "next/link";

// This page now serves as a guide for users who land on the restaurant slug URL without a table ID.
export default async function RestaurantLandingPage({ params }: { params: { restaurantSlug: string } }) {

  const restaurant = await getRestaurantBySlug(params.restaurantSlug);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
        <Scan size={60} className="mx-auto text-blue-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to {restaurant?.restaurant_name || 'Our Restaurant'}!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          To view the menu and place an order, please scan the QR code located at your table.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold text-blue-800">
            Looking for the dashboard?
          </p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Restaurant Login
          </Link>
        </div>
      </div>
    </div>
  );
}