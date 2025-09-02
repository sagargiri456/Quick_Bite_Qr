"use client";

import { useState, useMemo } from "react";
import { useMenuItems } from "@/lib/hooks/useMenuItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MenuItemsPage() {
  const { menuItems, loading, error } = useMenuItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch =
        categoryFilter === "All" || item.category === categoryFilter;

      const statusMatch =
        statusFilter === "All" ||
        (item.available ? "Active" : "Inactive") === statusFilter;

      let priceMatch = true;
      if (priceRange !== "All") {
        const [min, max] = priceRange.split("-").map(Number);
        priceMatch = item.price >= min && (max ? item.price <= max : true);
      }

      return searchMatch && categoryMatch && statusMatch && priceMatch;
    });
  }, [searchTerm, categoryFilter, statusFilter, priceRange, menuItems]);

  if (loading) return <p>Loading menu items...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Menu Items</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search menu items..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{item.description}</p>
                <p className="text-green-600 font-semibold mt-2">${item.price}</p>
                <p className="text-sm text-slate-500">
                  {item.available ? "Active" : "Inactive"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
