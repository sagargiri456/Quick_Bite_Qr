"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
// ... other imports
import { Order } from "./OrderTypes";

// FIXED: Add { credentials: 'include' } to the fetcher
const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || 'Failed to fetch orders');
    }
    return res.json();
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const { data: orders = [], isLoading } = useSWR<Order[]>("orders-history", () => fetcher("/api/orders"), {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });

  // ... The rest of this file is correct and does not need to be changed ...
  const filteredOrders = useMemo(() => {
    let relevantOrders = orders.filter((order: Order) => order.status === 'complete' || order.status === 'cancelled');

    return relevantOrders.filter((order: Order) => {
      const searchMatch =
        order.track_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tables?.table_number?.toString().toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        selectedStatus === "All" || order.status === selectedStatus;

      return searchMatch && statusMatch;
    });
  }, [orders, searchTerm, selectedStatus]);

  // ... JSX for the component
  return (
      <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
        {/* Component JSX goes here, no changes needed */}
      </div>
  );
}