"use client";

import Link from "next/link";
import { Utensils, Clock, List, Table as TableIcon } from "lucide-react";

export function DashboardNavCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Link 
        href="/dashboard/tables" 
        className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-100 shadow-medium hover:shadow-impressive hover:-translate-y-0.5 transition-all duration-300 p-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
            <TableIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-lg">Tables</div>
            <div className="text-slate-600 text-sm">Seating & turnover</div>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
      <Link 
        href="/dashboard/menus" 
        className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-100 shadow-medium hover:shadow-impressive hover:-translate-y-0.5 transition-all duration-300 p-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-lg">Menus</div>
            <div className="text-slate-600 text-sm">Collections & sets</div>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
      <Link 
        href="/dashboard/menu_items" 
        className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-100 shadow-medium hover:shadow-impressive hover:-translate-y-0.5 transition-all duration-300 p-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
            <List className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-lg">Menu Items</div>
            <div className="text-slate-600 text-sm">Dishes & prices</div>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
      <Link 
        href="/dashboard/orders" 
        className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-medium hover:shadow-impressive hover:-translate-y-0.5 transition-all duration-300 p-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-lg">Order History</div>
            <div className="text-slate-600 text-sm">Past orders</div>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}



