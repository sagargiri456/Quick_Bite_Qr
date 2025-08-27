"use client";

import { useState, useEffect } from "react";
import { RecentOrders } from "@/components/RecentOrders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Users, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  dateRange?: any;
}

// Simulated live order data
const generateLiveOrder = () => {
  const customers = ["John Smith", "Sarah Johnson", "Mike Davis", "Emma Wilson", "David Brown", "Lisa Garcia"];
  const items = [
    "Grilled Salmon", "Beef Burger", "Caesar Salad", "Chicken Alfredo", "Margherita Pizza", "Pasta Carbonara"
  ];
  const statuses = ["Preparing", "Ready", "Served"];
  
  return {
    id: Math.floor(Math.random() * 10000),
    customer: customers[Math.floor(Math.random() * customers.length)],
    items: [items[Math.floor(Math.random() * items.length)]],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: Math.floor(Math.random() * 50) + 15,
    time: new Date().toLocaleTimeString(),
    table: `A${Math.floor(Math.random() * 5) + 1}`,
    priority: Math.random() > 0.7 ? "High" : "Normal"
  };
};

export function LiveOrdersPanel({ dateRange }: Props) {
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Initialize with some orders
    const initialOrders = Array.from({ length: 5 }, () => generateLiveOrder());
    setLiveOrders(initialOrders);

    // Simulate new orders coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of new order
        const newOrder = generateLiveOrder();
        setLiveOrders(prev => [newOrder, ...prev.slice(0, 9)]); // Keep max 10 orders
        setNewOrderCount(prev => prev + 1);
        setIsPulsing(true);
        
        // Stop pulsing after 3 seconds
        setTimeout(() => setIsPulsing(false), 3000);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready": return "bg-green-100 text-green-800 border-green-200";
      case "Served": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "High" ? "bg-red-100 text-red-800 border-red-200" : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Live Orders Header with Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-blue-600 text-white transition-all duration-300 ${isPulsing ? 'animate-pulse animate-glow' : ''}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Live Orders</CardTitle>
                <p className="text-slate-600 text-sm">Real-time order tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{liveOrders.length}</div>
                <div className="text-xs text-slate-600">Active Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {liveOrders.filter(o => o.status === "Ready").length}
                </div>
                <div className="text-xs text-slate-600">Ready to Serve</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${liveOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-600">Total Value</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveOrders.map((order, index) => (
          <Card 
            key={order.id} 
            className={`hover:shadow-lg transition-all duration-300 animate-slide-up ${
              index === 0 && newOrderCount > 0 ? 'animate-pulse border-blue-300 animate-glow' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600">#{order.id}</span>
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Customer:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Table:</span>
                <span className="font-medium">{order.table}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Items:</span>
                <span className="font-medium">{order.items.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Amount:</span>
                <span className="font-medium text-green-600">${order.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Time:</span>
                <span className="font-medium text-blue-600">{order.time}</span>
              </div>
              
              {/* Progress Bar for Preparing Orders */}
              {order.status === "Preparing" && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-500 h-2 rounded-full animate-pulse transition-all duration-1000" style={{ width: '75%' }}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}


