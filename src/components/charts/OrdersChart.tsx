"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type ChartData = {
  name: string;
  orders?: number;
  revenue?: number;
};

export default function OrdersChart({ data }: { data: ChartData[] }) {
  return (
    <div className="w-full h-80"> {/* 👈 FIX: Parent height */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <div className="w-full h-80"> {/* 👈 FIX: Parent height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
