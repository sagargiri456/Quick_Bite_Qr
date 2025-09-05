 'use client';
import React from 'react';
import { DashboardNavCards } from '@/components/DashboardNavCards';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardNavCards />
      {/* Sidebar
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-indigo-600 border-b">
          QuickBite QR
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            disabled={loading}
            aria-label="Logout"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={24} />
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </aside> */}

      {/* Main Content Area */}
      <main className="flex-1 p-4 py-0 overflow-auto">{children}</main>
    </div>
  );
}