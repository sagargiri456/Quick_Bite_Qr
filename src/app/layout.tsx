import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Mark AuthListener as a client component if it uses browser APIs
import AuthListener from "@/components/AuthListener";
import OfflineIndicator from "@/components/OfflineIndicator";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import OfflineStatusBar from "@/components/OfflineStatusBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Bite QR - Restaurant Management",
  description: "Restaurant management and QR code generation app with offline support",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quick Bite QR",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body

      >
        {/* ✅ Wrap client-only logic in a dedicated client component */}
        <AuthListener />
        <OfflineIndicator />
        <ServiceWorkerRegistration />
        {children}
        <OfflineStatusBar />
      </body>
    </html>
  );
}
