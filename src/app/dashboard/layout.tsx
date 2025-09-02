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
} from 'lucide-react';
import { logout } from '@/lib/auth/logout';
import { DashboardNavCards } from '@/components/DashboardNavCards';

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-lg font-medium ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={24} />
      {label}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/dashboard/tables', label: 'Tables', icon: SquareKanban },
    { href: '/dashboard/orders', label: 'Orders', icon: ListOrdered }, // ✅ Orders added
  ];

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