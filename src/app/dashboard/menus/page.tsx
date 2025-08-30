"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, Plus, Edit, Eye, Search, TrendingUp, DollarSign, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Sample menu data with images
const menus = [
  {
    id: "1",
    name: "Dinner Menu",
    description: "Our signature dinner experience featuring seasonal ingredients",
    category: "Main Menu",
    status: "Active",
    items: 24,
    avgPrice: 28.50,
    lastUpdated: "2024-01-20",
    popularity: 95,
    seasonal: true,
    chef: "Chef Michael",
    cuisine: "Contemporary American",
    image: "/images/restaurant-ambiance.jpg"
  },
  {
    id: "2",
    name: "Lunch Specials",
    description: "Quick and delicious lunch options for busy professionals",
    category: "Special Menu",
    status: "Active",
    items: 12,
    avgPrice: 18.75,
    lastUpdated: "2024-01-22",
    popularity: 88,
    seasonal: false,
    chef: "Chef Sarah",
    cuisine: "International Fusion",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format"
  },
  {
    id: "3",
    name: "Weekend nien",
    description: "Indulgent brunch offerings for weekend relaxation",
    category: "Special Menu",
    status: "Active",
    items: 18,
    avgPrice: 22.40,
    lastUpdated: "2024-01-19",
    popularity: 92,
    seasonal: true,
    chef: "Chef Emma",
  
    image: "https://images.unsplash.com/photo-1551218808-94e220e796d9?w=400&h=300&fit=crop&auto=format"
  },
  {
    id: "4",
    name: "Holiday Feast",
    description: "Festive holiday menu with traditional favorites",
    category: "Seasonal Menu",
    status: "Inactive",
    items: 15,
    avgPrice: 45.00,
    lastUpdated: "2023-12-15",
    popularity: 78,
    seasonal: true,
    chef: "Chef David",
    cuisine: "Traditional Holiday",
    image: "/images/holiday-feast.jpg"
  },
  {
    id: "5",
    name: "Happy Hour",
    description: "Appetizers and drinks for evening socializing",
    category: "Bar Menu",
    status: "Active",
    items: 8,
    avgPrice: 12.50,
    lastUpdated: "2024-01-18",
    popularity: 85,
    seasonal: false,
    chef: "Chef Lisa",
    cuisine: "Bar & Appetizers",
    image: "/images/bar-appetizers.jpg"
  },
  {
    id: "6",
    name: "Kids Menu",
    description: "Family-friendly options for our youngest guests",
    category: "Special Menu",
    status: "Active",
    items: 6,
    avgPrice: 14.25,
    lastUpdated: "2024-01-21",
    popularity: 82,
    seasonal: false,
    chef: "Chef Anna",
    cuisine: "Family Friendly",
    image: "https://images.unsplash.com/photo-1504674900240-8947e31be9f6?w=400&h=300&fit=crop&auto=format"
  }
];

// Chart data
const menuPerformanceData = [
  { menu: "Dinner", revenue: 2840, orders: 95, avgRating: 4.6 },
  { menu: "Lunch", revenue: 1680, orders: 88, avgRating: 4.4 },
  { menu: "Brunch", revenue: 2016, orders: 92, avgRating: 4.5 },
  { menu: "Holiday", revenue: 675, orders: 78, avgRating: 4.3 },
  { menu: "Happy Hour", revenue: 1000, orders: 85, avgRating: 4.2 },
  { menu: "Kids", revenue: 855, orders: 82, avgRating: 4.1 }
];

const categoryDistribution = [
  { name: "Main Menu", value: 35, color: "#0088FE" },
  { name: "Special Menu", value: 30, color: "#00C49F" },
  { name: "Seasonal Menu", value: 20, color: "#FFBB28" },
  { name: "Bar Menu", value: 15, color: "#FF8042" }
];

const statusColors = {
  "Active": "bg-green-100 text-green-800 border-green-200",
  "Inactive": "bg-gray-100 text-gray-800 border-gray-200",
  "Draft": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Archived": "bg-red-100 text-red-800 border-red-200"
};

export default function MenusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cuisineFilter, setCuisineFilter] = useState("All");

  // Filter menus based on search and filters
  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const searchMatch = 
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.chef.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = categoryFilter === "All" || menu.category === categoryFilter;
      const statusMatch = statusFilter === "All" || menu.status === statusFilter;
      const cuisineMatch = cuisineFilter === "All" || menu.cuisine === cuisineFilter;
      
      return searchMatch && categoryMatch && statusMatch && cuisineMatch;
    });
  }, [searchTerm, categoryFilter, statusFilter, cuisineFilter]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalMenus = menus.length;
    const activeMenus = menus.filter(m => m.status === "Active").length;
    const totalItems = menus.reduce((sum, m) => sum + m.items, 0);
    const avgPrice = menus.reduce((sum, m) => sum + m.avgPrice, 0) / totalMenus;
    const totalRevenue = menus.reduce((sum, m) => sum + (m.avgPrice * m.popularity), 0);
    const avgPopularity = menus.reduce((sum, m) => sum + m.popularity, 0) / totalMenus;
    
    return {
      totalMenus,
      activeMenus,
      totalItems,
      avgPrice,
      totalRevenue,
      avgPopularity
    };
  }, [menus]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-green-600 text-white">
              <Utensils className="w-5 h-5" />
            </span>
            Menu Management & Analytics
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Menu
            </Button>
            <Link href="/" className="text-blue-600 hover:underline">
              <Button variant="outline" size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
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
                  <div className="text-2xl font-bold text-purple-800">{analytics.avgPopularity.toFixed(0)}%</div>
                  <div className="text-xs text-purple-600">Customer satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Menu Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Menu Performance</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Menu Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  placeholder="Search menus..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="Main Menu">Main Menu</option>
                  <option value="Special Menu">Special Menu</option>
                  <option value="Seasonal Menu">Seasonal Menu</option>
                  <option value="Bar Menu">Bar Menu</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <select 
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Cuisines</option>
                  <option value="Contemporary American">Contemporary American</option>
                  <option value="International Fusion">International Fusion</option>
                  <option value="Modern Brunch">Modern Brunch</option>
                  <option value="Traditional Holiday">Traditional Holiday</option>
                  <option value="Bar & Appetizers">Bar & Appetizers</option>
                  <option value="Family Friendly">Family Friendly</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Menu Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={menu.image}
                  alt={menu.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/restaurant-ambiance.jpg`;
                  }}
                />
                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[menu.status as keyof typeof statusColors]} border backdrop-blur-sm`}
                  >
                    {menu.status}
                  </Badge>
                </div>
                {/* Seasonal Badge Overlay */}
                {menu.seasonal && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 backdrop-blur-sm">
                      Seasonal
                    </Badge>
                  </div>
                )}
                {/* Items Count Overlay */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="font-bold text-blue-600 text-sm">{menu.items} items</span>
                  </div>
                </div>
                {/* Avg Price Overlay */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="font-bold text-green-600 text-sm">${menu.avgPrice}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 mb-1">{menu.name}</CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{menu.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-600">Category:</span>
                    <div className="font-medium">{menu.category}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Cuisine:</span>
                    <div className="font-medium">{menu.cuisine}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Chef:</span>
                  <span className="font-medium">{menu.chef}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Popularity:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{menu.popularity}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Updated:</span>
                  <span className="font-medium">{menu.lastUpdated}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-indigo-100 bg-indigo-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-indigo-600 mb-1">Menu Categories</div>
                <div className="text-2xl font-bold text-indigo-800">4</div>
                <div className="text-xs text-indigo-600">
                  Main, Special, Seasonal, Bar
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-emerald-600 mb-1">Seasonal Menus</div>
                <div className="text-2xl font-bold text-emerald-800">3</div>
                <div className="text-xs text-emerald-600">
                  Dinner, Brunch, Holiday
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-amber-600 mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-amber-800">
                  ${analytics.totalRevenue.toFixed(0)}
                </div>
                <div className="text-xs text-amber-600">
                  From all active menus
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

