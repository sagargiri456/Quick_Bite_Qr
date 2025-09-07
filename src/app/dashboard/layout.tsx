 'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  UtensilsCrossed,
  SquareKanban,
  LogOut,
  ListOrdered,
  Menu,
  X,
} from 'lucide-react';
import { logout } from '@/lib/auth/logout';
import { DashboardNavCards } from '@/components/DashboardNavCards';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen overflow-hidden z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed lg:z-auto lg:overflow-hidden
      `}>
        <DashboardNavCards onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-2 sm:p-4 lg:p-6 overflow-auto lg:ml-64">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}