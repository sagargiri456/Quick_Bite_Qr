"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Soup, Plus, Edit, Eye, Search, TrendingUp, DollarSign, Clock, Star, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client"; 


type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  photo_url?: string;
  available?: boolean;
  created_at?: string;
};


// Chart data
const itemPerformanceData = [
  { item: "Grilled Salmon", revenue: 5070, orders: 156, profit: 2145 },
  { item: "Truffle Pasta", revenue: 3752, orders: 134, profit: 2077 },
  { item: "Caesar Salad", revenue: 3118, orders: 189, profit: 1937 },
  { item: "Beef Tenderloin", revenue: 4410, orders: 98, profit: 2205 },
  { item: "Chocolate Lava", revenue: 2421, orders: 167, profit: 1628 },
  { item: "Mushroom Risotto", revenue: 2912, orders: 112, profit: 1680 }
];

const categoryRevenue = [
  { name: "Main Course", value: 65, color: "#0088FE" },
  { name: "Appetizer", value: 20, color: "#00C49F" },
  { name: "Dessert", value: 15, color: "#FFBB28" }
];

const statusColors = {
  "Active": "bg-green-100 text-green-800 border-green-200",
  "Inactive": "bg-gray-100 text-gray-800 border-gray-200",
  "Draft": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Seasonal": "bg-orange-100 text-orange-800 border-orange-200"
};

const dietaryColors = {
  "Vegetarian": "bg-green-100 text-green-800 border-green-200",
  "Vegan": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Gluten-Free": "bg-blue-100 text-blue-800 border-blue-200",
  "Low-Carb": "bg-purple-100 text-purple-800 border-purple-200",
  "Dairy-Free": "bg-yellow-100 text-yellow-800 border-yellow-200"
};

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("All");


  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false });
        // console.log(data);

      if (error) {
        console.error("Error fetching menu items:", error);
      } else {
        setMenuItems(data || []);
      }
      setLoading(false);
    };

    fetchMenuItems();
  }, []);


  // Filter menu items based on search and filters
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const searchMatch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        
      
      const categoryMatch = categoryFilter === "All" || item.category === categoryFilter;
      
      let priceMatch = true;
      if (priceRange !== "All") {
        const [min, max] = priceRange.split("-").map(Number);
        priceMatch = item.price >= min && item.price <= max;
      }
      
      return searchMatch && categoryMatch  && priceMatch;
    });
  }, [searchTerm, categoryFilter, priceRange]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalItems = menuItems.length;
    console.log(totalItems);
    const activeItems = menuItems.filter(i => i.status === "Active").length;
    const totalRevenue = menuItems.reduce((sum, i) => sum + (i.price * i.orders), 0);
    const totalProfit = menuItems.reduce((sum, i) => sum + (i.profit * i.orders), 0);
    const avgPrice = menuItems.reduce((sum, i) => sum + i.price, 0) / totalItems;
    const avgRating = menuItems.reduce((sum, i) => sum + i.rating, 0) / totalItems;
    const totalOrders = menuItems.reduce((sum, i) => sum + i.orders, 0);
    
    return {
      totalItems,
      activeItems,
      totalRevenue,
      totalProfit,
      avgPrice,
      avgRating,
      totalOrders
    };
  }, [menuItems]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-orange-600 text-white">
              <Soup className="w-5 h-5" />
            </span>
            Menu Items Management
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Link href="/" className="text-blue-600 hover:underline">
              <Button variant="outline" size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-orange-100 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Soup className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-orange-600 mb-1">Total Items</div>
                  <div className="text-2xl font-bold text-orange-800">{analytics.totalItems}</div>
                  <div className="text-xs text-orange-600">{analytics.activeItems} active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-green-600 mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-800">${(analytics.totalRevenue / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-green-600">From all items</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 mb-1">Total Profit</div>
                  <div className="text-2xl font-bold text-blue-800">${(analytics.totalProfit / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-blue-600">Net profit</div>
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
                  <div className="text-sm text-purple-600 mb-1">Avg. Rating</div>
                  <div className="text-2xl font-bold text-purple-800">{analytics.avgRating.toFixed(1)}</div>
                  <div className="text-xs text-purple-600">Customer satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Item Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={itemPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
                  <Bar dataKey="profit" fill="#10B981" name="Profit ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Revenue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryRevenue.map((entry, index) => (
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
                  placeholder="Search menu items..." 
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
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Prices</option>
                  <option value="0-20">$0 - $20</option>
                  <option value="20-35">$20 - $35</option>
                  <option value="35-50">$35 - $50</option>
                  <option value="50-100">$50+</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Food Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/caesar-salad.jpg`;
                  }}
                />
                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[item.status as keyof typeof statusColors]} border backdrop-blur-sm`}
                  >
                    {item.status}
                  </Badge>
                </div>
                {/* Seasonal Badge Overlay */}
                {item.seasonal && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 backdrop-blur-sm">
                      Seasonal
                    </Badge>
                  </div>
                )}
                {/* Price Overlay */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="font-bold text-green-600 text-lg">${item.price}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 mb-1">{item.name}</CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-600">Category:</span>
                    <div className="font-medium">{item.category}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Subcategory:</span>
                    <div className="font-medium">{item.subcategory}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Cost:</span>
                    <div className="font-medium text-red-600">${item.cost}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Profit:</span>
                    <div className="font-medium text-green-600">${item.profit}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Chef:</span>
                  <span className="font-medium">{item.chef}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Prep Time:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="font-medium">{item.preparationTime}m</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Calories:</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="font-medium">{item.calories}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Popularity:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{item.popularity}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Orders:</span>
                  <span className="font-medium">{item.orders}</span>
                </div>
                
                {/* Dietary Information */}
                {item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.dietary.map((diet) => (
                      <Badge 
                        key={diet} 
                        variant="outline" 
                        className={`${dietaryColors[diet as keyof typeof dietaryColors]} text-xs`}
                      >
                        {diet}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="text-xs text-slate-500">
                    <span className="font-medium">Allergens:</span> {item.allergens.join(", ")}
                  </div>
                )}
                
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
                <div className="text-sm text-indigo-600 mb-1">Avg. Price</div>
                <div className="text-2xl font-bold text-indigo-800">${analytics.avgPrice.toFixed(2)}</div>
                <div className="text-xs text-indigo-600">
                  Per menu item
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-emerald-600 mb-1">Total Orders</div>
                <div className="text-2xl font-bold text-emerald-800">{analytics.totalOrders}</div>
                <div className="text-xs text-emerald-600">
                  Across all items
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-amber-600 mb-1">Profit Margin</div>
                <div className="text-2xl font-bold text-amber-800">
                  {((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-amber-600">
                  Overall profitability
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

