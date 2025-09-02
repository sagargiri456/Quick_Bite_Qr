// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthListener from "@/components/AuthListener";
import OfflineIndicator from "@/components/OfflineIndicator";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import OfflineStatusBar from "@/components/OfflineStatusBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Bite QR - Restaurant Management",
  description:
    "Restaurant management and QR code generation app with offline support",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quick Bite QR",
  },
  formatDetection: {
    telephone: false,
  },
};

// Fix for metadata warnings
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Global client-side hooks/components */}
        <AuthListener />
        <OfflineIndicator />
        <ServiceWorkerRegistration />

        {/* Main app pages */}
        {children}

        {/* Status UI */}
        <OfflineStatusBar />
      </body>
    </html>
  );
}
