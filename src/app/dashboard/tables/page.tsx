"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table as TableIcon, Clock, Users, TrendingUp, Search, Plus, Edit, Eye, Calendar, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { supabase } from "@/lib/supabase/client";

type Table = {
  table_number: number;
  qr_code_url: string;
  created_at: string;
};


// Enhanced chart data
const occupancyData = [
  { time: "5:00 PM", occupancy: 45, reservations: 15, revenue: 1200 },
  { time: "6:00 PM", occupancy: 78, reservations: 25, revenue: 2100 },
  { time: "7:00 PM", occupancy: 92, reservations: 8, revenue: 2800 },
  { time: "8:00 PM", occupancy: 85, reservations: 12, revenue: 2400 },
  { time: "9:00 PM", occupancy: 62, reservations: 18, revenue: 1800 },
  { time: "10:00 PM", occupancy: 38, reservations: 5, revenue: 1100 },
];

const turnoverData = [
  { table: "A1", turnover: 45, revenue: 89.50, efficiency: 85 },
  { table: "A4", turnover: 38, revenue: 67.25, efficiency: 78 },
  { table: "B1", turnover: 52, revenue: 156.80, efficiency: 92 },
  { table: "B3", turnover: 42, revenue: 98.75, efficiency: 88 },
  { table: "C2", turnover: 41, revenue: 73.45, efficiency: 82 },
  { table: "D1", turnover: 58, revenue: 234.90, efficiency: 95 },
];

const sectionData = [
  { name: "Main Dining", value: 6, fill: "#3B82F6" },
  { name: "Patio", value: 4, fill: "#10B981" },
  { name: "Private Room", value: 2, fill: "#F59E0B" },
];

const statusColors = {
  "Available": "bg-green-100 text-green-800 border-green-200",
  "Occupied": "bg-red-100 text-red-800 border-red-200",
  "Reserved": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Cleaning": "bg-blue-100 text-blue-800 border-blue-200",
  "Out of Service": "bg-gray-100 text-gray-800 border-gray-200",
};

const sectionColors = {
  "Main Dining": "bg-blue-100 text-blue-800",
  "Patio": "bg-green-100 text-green-800",
  "Private Room": "bg-orange-100 text-orange-800",
};

export default function TablePage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [capacityFilter, setCapacityFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");


  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("created_at", { ascending: false });
        console.log(data);

      if (error) {
        console.error("Error fetching tables:", error);
      } else {
        console.log("Fetched tables:", data);
        setTables(data || []);
      }
      setLoading(false);
    };

    fetchTables();
  }, []);


  // Filter tables based on search and filters
  const filteredTables = useMemo(() => {
    if (!tables) return [];
    return tables.filter(table => {
      const searchMatch = 
        table.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.section.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === "All" || table.status === statusFilter;
      
      let capacityMatch = true;
      if (capacityFilter !== "All") {
        const [min, max] = capacityFilter.split("-").map(Number);
        capacityMatch = table.capacity >= min && table.capacity <= max;
      }

      const sectionMatch = sectionFilter === "All" || table.section === sectionFilter;
      
      return searchMatch && statusMatch && capacityMatch && sectionMatch;
    });
  }, [searchTerm, statusFilter, capacityFilter, sectionFilter]);

  // Calculate enhanced analytics
  const analytics = useMemo(() => {
    const totalTables = tables.length;
    const occupiedTables = tables.filter(t => t.status === "Occupied").length;
    const reservedTables = tables.filter(t => t.status === "Reserved").length;
    const availableTables = tables.filter(t => t.status === "Available").length;
    const cleaningTables = tables.filter(t => t.status === "Cleaning").length;
    
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const currentOccupancy = tables.filter(t => t.status === "Occupied").reduce((sum, t) => sum + t.currentParty, 0);
    
    const occupiedTablesList = tables.filter(t => t.status === "Occupied");
    const avgTurnover = occupiedTablesList.length > 0 
      ? occupiedTablesList.reduce((sum, t) => sum + t.turnover, 0) / occupiedTablesList.length 
      : 0;
      
    const totalRevenue = tables.filter(t => t.status === "Occupied").reduce((sum, t) => sum + t.revenue, 0);
    const avgRevenuePerTable = occupiedTables > 0 ? totalRevenue / occupiedTables : 0;
    
    // Section breakdown
    const sectionBreakdown = tables.reduce((acc, table) => {
      if (!acc[table.section]) {
        acc[table.section] = { total: 0, occupied: 0, revenue: 0 };
      }
      acc[table.section].total++;
      if (table.status === "Occupied") {
        acc[table.section].occupied++;
        acc[table.section].revenue += table.revenue;
      }
      return acc;
    }, {} as Record<string, { total: number; occupied: number; revenue: number }>);
    
    // Calculate percentages with zero division protection
    const occupancyRate = totalTables > 0 ? (occupiedTables / totalTables) * 100 : 0;
    const capacityUtilization = totalCapacity > 0 ? (currentOccupancy / totalCapacity) * 100 : 0;
    
    return {
      totalTables,
      occupiedTables,
      reservedTables,
      availableTables,
      cleaningTables,
      totalCapacity,
      currentOccupancy,
      avgTurnover,
      totalRevenue,
      avgRevenuePerTable,
      occupancyRate,
      capacityUtilization,
      sectionBreakdown,
    };
  }, [tables]);

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600 text-white">
              <TableIcon className="w-5 h-5" />
            </span>
            Table Analytics & Management
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
            <Link href="/" className="text-blue-600 hover:underline">
              <Button variant="outline" size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TableIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 mb-1">Total Tables</div>
                  <div className="text-2xl font-bold text-blue-800">{analytics.totalTables}</div>
                  <div className="text-xs text-blue-600">Across all sections</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-green-600 mb-1">Current Occupancy</div>
                  <div className="text-2xl font-bold text-green-800">{analytics.occupiedTables}</div>
                  <div className="text-xs text-green-600">{analytics.occupancyRate.toFixed(1)}% occupied</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-100 bg-yellow-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-yellow-600 mb-1">Avg. Turnover</div>
                  <div className="text-2xl font-bold text-yellow-800">{analytics.avgTurnover.toFixed(0)}m</div>
                  <div className="text-xs text-yellow-600">Per occupied table</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-100 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-purple-800">${analytics.totalRevenue.toFixed(2)}</div>
                  <div className="text-xs text-purple-600">${analytics.avgRevenuePerTable.toFixed(2)} avg/table</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Occupancy & Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Hourly Occupancy & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="occupancy" fill="#3B82F6" name="Occupancy %" />
                  <Bar yAxisId="left" dataKey="reservations" fill="#10B981" name="Reservations" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={2} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Section Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Section Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Table Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Table Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="table" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="turnover" fill="#F59E0B" name="Turnover (min)" />
                <Bar yAxisId="left" dataKey="revenue" fill="#EF4444" name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={2} name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  placeholder="Search tables..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
                <select 
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Sizes</option>
                  <option value="2-4">2-4 Seats</option>
                  <option value="5-6">5-6 Seats</option>
                  <option value="7-8">7-8 Seats</option>
                  <option value="9-10">9-10 Seats</option>
                </select>
                <select 
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All Sections</option>
                  <option value="Main Dining">Main Dining</option>
                  <option value="Patio">Patio</option>
                  <option value="Private Room">Private Room</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <Card key={table.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800">{table.id}</CardTitle>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[table.status as keyof typeof statusColors]} border`}
                    >
                      {table.status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${sectionColors[table.section as keyof typeof sectionColors]} text-xs`}
                    >
                      {table.section}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Capacity:</span>
                  <span className="font-medium">{table.capacity} seats</span>
                </div>
                
                {table.status === "Occupied" && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Current Party:</span>
                      <span className="font-medium">{table.currentParty} people</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Started:</span>
                      <span className="font-medium">{table.startTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Est. End:</span>
                      <span className="font-medium">{table.estimatedEnd}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Turnover:</span>
                      <span className="font-medium">{table.turnover}m</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Revenue:</span>
                      <span className="font-medium text-green-600">${table.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Server:</span>
                      <span className="font-medium">{table.server}</span>
                    </div>
                  </>
                )}
                
                {table.status === "Reserved" && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Reserved for:</span>
                      <span className="font-medium">{table.startTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Est. Duration:</span>
                      <span className="font-medium">2.5h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Server:</span>
                      <span className="font-medium">{table.server}</span>
                    </div>
                  </>
                )}

                {table.status === "Available" && (
                  <div className="text-center py-4">
                    <div className="text-green-600 font-medium">Ready for guests</div>
                    <div className="text-xs text-slate-500 mt-1">No current activity</div>
                  </div>
                )}

                {table.status === "Cleaning" && (
                  <div className="text-center py-4">
                    <div className="text-blue-600 font-medium">Under maintenance</div>
                    <div className="text-xs text-slate-500 mt-1">Will be available soon</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-orange-100 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-orange-600 mb-1">Capacity Utilization</div>
                <div className="text-2xl font-bold text-orange-800">
                  {analytics.capacityUtilization.toFixed(1)}%
                </div>
                <div className="text-xs text-orange-600">
                  {analytics.currentOccupancy} of {analytics.totalCapacity} seats
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-indigo-100 bg-indigo-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-indigo-600 mb-1">Reservation Rate</div>
                <div className="text-2xl font-bold text-indigo-800">
                  {((analytics.reservedTables / analytics.totalTables) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-indigo-600">
                  {analytics.reservedTables} tables reserved
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-emerald-600 mb-1">Available Tables</div>
                <div className="text-2xl font-bold text-emerald-800">
                  {analytics.availableTables}
                </div>
                <div className="text-xs text-emerald-600">
                  Ready for new guests
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Cleaning</div>
                <div className="text-2xl font-bold text-blue-800">
                  {analytics.cleaningTables}
                </div>
                <div className="text-xs text-blue-600">
                  Under maintenance
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Section Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analytics.sectionBreakdown).map(([section, data]) => (
                <div key={section} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800">{section}</h3>
                    <Badge className={sectionColors[section as keyof typeof sectionColors]}>
                      {data.total} tables
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Occupied:</span>
                      <span className="font-medium">{data.occupied}/{data.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Revenue:</span>
                      <span className="font-medium text-green-600">${data.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Occupancy Rate:</span>
                      <span className="font-medium">{((data.occupied / data.total) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

