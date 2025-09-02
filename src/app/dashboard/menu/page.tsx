// src/app/dashboard/menu/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMenus } from "@/lib/hooks/useMenus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, Plus, Edit, Eye, Search, TrendingUp, DollarSign, Star, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// NOTE: Chart data is still sample data. The backend would need to be expanded
// with analytics tables to make these charts dynamic.
const menuPerformanceData = [
  { menu: "Dinner", revenue: 2840, orders: 95, avgRating: 4.6 },
  { menu: "Lunch", revenue: 1680, orders: 88, avgRating: 4.4 },
  { menu: "Brunch", revenue: 2016, orders: 92, avgRating: 4.5 },
];

const categoryDistribution = [
  { name: "Main Menu", value: 40, color: "#0088FE" },
  { name: "Special Menu", value: 30, color: "#00C49F" },
  { name: "Seasonal Menu", value: 30, color: "#FFBB28" },
];

const statusColors: { [key: string]: string } = {
  "Active": "bg-green-100 text-green-800 border-green-200",
  "Inactive": "bg-gray-100 text-gray-800 border-gray-200",
  "Draft": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export default function MenusPage() {
  const { menus, loading, error } = useMenus();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const searchMatch =
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = categoryFilter === "All" || menu.category === categoryFilter;
      const statusMatch = statusFilter === "All" || menu.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [searchTerm, categoryFilter, statusFilter, menus]);

  const analytics = useMemo(() => {
    const totalMenus = menus.length;
    const activeMenus = menus.filter(m => m.status === "Active").length;
    const totalItems = menus.reduce((sum, m) => sum + (m.item_count || 0), 0);
    const avgPrice = menus.length > 0 ? menus.reduce((sum, m) => sum + (m.avg_price || 0), 0) / menus.length : 0;
    return { totalMenus, activeMenus, totalItems, avgPrice };
  }, [menus]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-green-600 text-white">
              <Utensils className="w-5 h-5" />
            </span>
            Menu Management & Analytics
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard/menu/add-collection">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Menu
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Utensils className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-green-600 mb-1">Total Menus</div>
                  <div className="text-2xl font-bold text-green-800">{analytics.totalMenus}</div>
                  <div className="text-xs text-green-600">{analytics.activeMenus} active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 mb-1">Total Items</div>
                  <div className="text-2xl font-bold text-blue-800">{analytics.totalItems}</div>
                  <div className="text-xs text-blue-600">Across all menus</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-100 bg-yellow-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-yellow-600 mb-1">Avg. Price</div>
                  <div className="text-2xl font-bold text-yellow-800">${analytics.avgPrice.toFixed(2)}</div>
                  <div className="text-xs text-yellow-600">Per menu item</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-100 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">Avg. Popularity</div>
                  <div className="text-2xl font-bold text-purple-800">N/A</div>
                  <div className="text-xs text-purple-600">Analytics coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Menu Performance (Sample)</CardTitle>
            </CardHeader>
            <CardContent>
              {isClient && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={menuPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="menu" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
                    <Bar dataKey="orders" fill="#10B981" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Menu Categories (Sample)</CardTitle>
            </CardHeader>
            <CardContent>
              {isClient && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value" >
                      {categoryDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search menus..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm" >
                  <option value="All">All Categories</option>
                  <option value="Main Menu">Main Menu</option>
                  <option value="Special Menu">Special Menu</option>
                  <option value="Seasonal Menu">Seasonal Menu</option>
                  <option value="Bar Menu">Bar Menu</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm" >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>
        ) : error ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenus.map((menu) => (
              <Card key={menu.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={menu.image || "/images/restaurant-ambiance.jpg"} alt={menu.name} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`${statusColors[menu.status]} border backdrop-blur-sm`}>
                      {menu.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-800 mb-1">{menu.name}</CardTitle>
                  <p className="text-sm text-slate-600 line-clamp-2">{menu.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Category:</span>
                    <div className="font-medium">{menu.category}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/menu_items?menu_id=${menu.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-3 h-3 mr-1" /> View Items
                      </Button>
                    </Link>
                    <Link href={`/dashboard/menu/edit-collection/${menu.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}