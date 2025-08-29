"use client";

import Link from "next/link";
import { Utensils, Clock, List, Table as TableIcon } from "lucide-react";

export function DashboardNavCards() {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-4 flex flex-col gap-4">
      {/* Tables */}
      <Link
        href="/dashboard/tables"
        className="group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100 shadow hover:shadow-lg transition-all duration-300 p-4"
      >
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md">
          <TableIcon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-base">Tables</div>
          <div className="text-slate-600 text-xs">Seating & turnover</div>
        </div>
      </Link>

      {/* Menus */}
      <Link
        href="/dashboard/menus"
        className="group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100 shadow hover:shadow-lg transition-all duration-300 p-4"
      >
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-base">Menus</div>
          <div className="text-slate-600 text-xs">Collections & sets</div>
        </div>
      </Link>

      {/* Menu Items */}
      <Link
        href="/dashboard/menu_items"
        className="group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100 shadow hover:shadow-lg transition-all duration-300 p-4"
      >
        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md">
          <List className="w-5 h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-base">Menu Items</div>
          <div className="text-slate-600 text-xs">Dishes & prices</div>
        </div>
      </Link>

      {/* Order History */}
      <Link
        href="/dashboard/orders"
        className="group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow hover:shadow-lg transition-all duration-300 p-4"
      >
        <div className="p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-md">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-base">Order History</div>
          <div className="text-slate-600 text-xs">Past orders</div>
        </div>
      </Link>
    </div>
  );
}

