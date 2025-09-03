// src/app/customer-end-pages/[restaurantSlug]/[tableId]/page.tsx (Server Component)

import React from 'react';
import { getPublicMenuItems, getRestaurantDetails } from '@/lib/api/public';
// FIXED: Use the correct relative path for the import
import MenuClient from './MenuClient'; 
import { notFound } from 'next/navigation';

export default async function CustomerMenuPage({
  params,
}: {
  params: { restaurantSlug: string; tableId: string };
}) {
  const { restaurantSlug, tableId } = params;

  // Fetch data on the server
  const [items, details] = await Promise.all([
    getPublicMenuItems(restaurantSlug),
    getRestaurantDetails(restaurantSlug),
  ]);

  if (!details) {
    notFound();
  }

  // Pass server-fetched data as props to the client component
  return (
    <MenuClient
      initialMenuItems={items || []}
      restaurantDetails={details}
      tableId={tableId}
      restaurantSlug={restaurantSlug}
    />
  );
}