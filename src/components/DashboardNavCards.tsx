// src->components->DashboardNavCards.tsx - "use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Utensils,
  Clock,
  List,
  Table as TableIcon,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/auth/logout";

interface DashboardNavCardsProps {
  onClose?: () => void;
}

export function DashboardNavCards({ onClose }: DashboardNavCardsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout(); 
      router.push("/login"); 
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 h-full bg-white/90 backdrop-blur-md rounded-none lg:rounded-2xl border border-gray-200 shadow-lg p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 overflow-y-auto lg:overflow-y-hidden">
      {/* Home / Brand Card */}
      <Link
        href="/dashboard"
        onClick={handleLinkClick}
        className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow hover:shadow-lg transition-all duration-300 p-3 sm:p-4"
      >
        <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md">
          <TableIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="text-slate-900 font-bold text-base sm:text-lg tracking-wide">
            QuickBite QR
          </div>
          <div className="text-slate-600 text-xs sm:text-sm">Dashboard Home</div>
        </div>
      </Link>

      {/* Menus */}
      <Link
        href="/dashboard/menu"
        onClick={handleLinkClick}
        className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100 shadow hover:shadow-lg transition-all duration-300 p-3 sm:p-4"
      >
        <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md">
          <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-sm sm:text-base">Menu</div>
          <div className="text-slate-600 text-xs">Collections & sets</div>
        </div>
      </Link>

      {/* Tables */}
      <Link
        href="/dashboard/tables"
        onClick={handleLinkClick}
        className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100 shadow hover:shadow-lg transition-all duration-300 p-3 sm:p-4"
      >
        <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md">
          <List className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-sm sm:text-base">Tables</div>
          <div className="text-slate-600 text-xs">Table Number & QR</div>
        </div>
      </Link>

      {/* Orders */}
      <Link
        href="/dashboard/orders"
        onClick={handleLinkClick}
        className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow hover:shadow-lg transition-all duration-300 p-3 sm:p-4"
      >
        <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-md">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-sm sm:text-base">Orders</div>
          <div className="text-slate-600 text-xs">Orders data</div>
        </div>
      </Link>

      {/* Logout - Positioned at bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow hover:shadow-lg transition-all duration-300 p-3 sm:p-4 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-sm sm:text-base">
              {loading ? "Logging out..." : "Logout"}
            </div>
            <div className="text-slate-600 text-xs">End your session</div>
          </div>
        </button>
      </div>
    </div>
  );
}