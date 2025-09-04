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
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen overflow-hidden">
        <DashboardNavCards />
      </div>

      {/* Main Content Area with left padding to account for sidebar */}
      <main className="flex-1 p-4 py-0 ml-64 overflow-auto">{children}</main>
    </div>
  );
}