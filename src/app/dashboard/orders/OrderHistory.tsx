"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, Filter, Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const orders = [
  { 
    id: "#1024", 
    customer: "John Smith", 
    time: "12:30 PM", 
    date: "2024-01-25",
    total: 45.99, 
    status: "Ready",
    items: 3,
    payment: "Credit Card",
    table: "A12"
  },
  { 
    id: "#1023", 
    customer: "Sarah Johnson", 
    time: "1:15 PM", 
    date: "2024-01-25",
    total: 32.50, 
    status: "Preparing",
    items: 2,
    payment: "Cash",
    table: "B8"
  },
  { 
    id: "#1022", 
    customer: "Mike Davis", 
    time: "2:00 PM", 
    date: "2024-01-25",
    total: 67.25, 
    status: "Pending",
    items: 4,
    payment: "Credit Card",
    table: "C15"
  },
  { 
    id: "#1021", 
    customer: "Emily Wilson", 
    time: "2:45 PM", 
    date: "2024-01-25",
    total: 28.99, 
    status: "Delivered",
    items: 2,
    payment: "Digital Wallet",
    table: "A5"
  },
  { 
    id: "#1020", 
    customer: "David Brown", 
    time: "3:30 PM", 
    date: "2024-01-25",
    total: 89.75, 
    status: "Ready",
    items: 5,
    payment: "Credit Card",
    table: "D3"
  },
  { 
    id: "#1019", 
    customer: "Lisa Garcia", 
    time: "4:15 PM", 
    date: "2024-01-25",
    total: 42.00, 
    status: "Delivered",
    items: 3,
    payment: "Cash",
    table: "B12"
  },
  { 
    id: "#1018", 
    customer: "Tom Anderson", 
    time: "5:00 PM", 
    date: "2024-01-25",
    total: 156.80, 
    status: "Preparing",
    items: 8,
    payment: "Credit Card",
    table: "E7"
  },
  { 
    id: "#1017", 
    customer: "Anna Martinez", 
    time: "5:45 PM", 
    date: "2024-01-25",
    total: 73.45, 
    status: "Ready",
    items: 4,
    payment: "Digital Wallet",
    table: "A9"
  }
];

const statusOptions = ["All", "Ready", "Preparing", "Pending", "Delivered"];
const paymentOptions = ["All", "Credit Card", "Cash", "Digital Wallet"];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ready':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Preparing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Pending':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Delivered':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const searchMatch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = selectedStatus === "All" || order.status === selectedStatus;

      // Payment filter
      const paymentMatch = selectedPayment === "All" || order.payment === selectedPayment;

      // Date filter
      const dateMatch = !selectedDate || order.date === format(selectedDate, "yyyy-MM-dd");

      return searchMatch && statusMatch && paymentMatch && dateMatch;
    });
  }, [searchTerm, selectedStatus, selectedPayment, selectedDate]);

  // Calculate stats based on filtered orders
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = filteredOrders.reduce((sum, order) => sum + order.items, 0);

    return { totalOrders, totalRevenue, avgOrderValue, totalItems };
  }, [filteredOrders]);

  // Export filtered data to CSV
  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Date", "Time", "Table", "Items", "Total", "Payment", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.id,
        order.customer,
        order.date,
        order.time,
        order.table,
        order.items,
        order.total,
        order.payment,
        order.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `order-history-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedPayment("All");
    setSelectedDate(undefined);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedStatus !== "All" || selectedPayment !== "All" || selectedDate;

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-slate-800 text-white">
              <Clock className="w-5 h-5" />
            </span>
            Order History
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="text-sm text-blue-600 mb-1">Total Orders</div>
              <div className="text-2xl font-bold text-blue-800">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="p-4">
              <div className="text-sm text-green-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-green-800">
                ${stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-100 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="text-sm text-purple-600 mb-1">Avg. Order Value</div>
              <div className="text-2xl font-bold text-purple-800">
                ${stats.avgOrderValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="text-sm text-orange-600 mb-1">Items Sold</div>
              <div className="text-2xl font-bold text-orange-800">
                {stats.totalItems}
              </div>
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
                  placeholder="Search orders..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                          {[searchTerm, selectedStatus, selectedPayment, selectedDate].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Filters</h3>
                        {hasActiveFilters && (
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                          </Button>
                        )}
                      </div>
                      
                      {/* Status Filter */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                        <div className="grid grid-cols-2 gap-2">
                          {statusOptions.map(status => (
                            <Button
                              key={status}
                              variant={selectedStatus === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedStatus(status)}
                              className="text-xs"
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Filter */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                          {paymentOptions.map(payment => (
                            <Button
                              key={payment}
                              variant={selectedPayment === payment ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                              className="text-xs"
                            >
                              {payment}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Date</label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                        {selectedDate && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-slate-600">
                              Selected: {format(selectedDate, "MMM dd, yyyy")}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDate(undefined)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {selectedStatus !== "All" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Status: {selectedStatus}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                      onClick={() => setSelectedStatus("All")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {selectedPayment !== "All" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Payment: {selectedPayment}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                      onClick={() => setSelectedPayment("All")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {selectedDate && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Date: {format(selectedDate, "MMM dd, yyyy")}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Recent Orders ({filteredOrders.length} of {orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Order ID</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Customer</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Date & Time</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Table</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Items</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Total</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Payment</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        className={`border-b hover:bg-slate-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-mono font-medium text-slate-800">{order.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-800">{order.customer}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-slate-600">
                            <div>{order.date}</div>
                            <div className="text-xs text-slate-500">{order.time}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono">
                            {order.table}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-600">{order.items} items</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-green-600">
                            ${order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{order.payment}</span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(order.status)} border`}
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 text-slate-300" />
                          <p>No orders match your current filters</p>
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredOrders.length} of {orders.length} results
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

