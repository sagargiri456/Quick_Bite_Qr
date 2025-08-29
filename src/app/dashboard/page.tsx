'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardNavCards } from "@/components/DashboardNavCards"
import { LiveOrderNotification } from "@/components/LiveOrderNotification"
import { LiveOrdersPanel } from "@/components/LiveOrdersPanel"
import Image from "next/image"

export default function Dashboard() {
  const [isOffline, setIsOffline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOffline(!navigator.onLine)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/restaurant-interior.jpg"
            alt="Restaurant Interior"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/60 to-indigo-900/40 z-10"></div>
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <motion.div
          className="bg-red-500 text-white text-center py-2 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚠️ You are offline. Some features may not be available.
        </motion.div>
      )}

      {/* Main Dashboard Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[2000px] mx-auto space-y-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <DashboardNavCards />
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {loading ? (
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                  <p className="animate-pulse text-gray-500">
                    Loading dashboard...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                  Failed to load dashboard: {error}
                </div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <LiveOrdersPanel />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <LiveOrderNotification />
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border-t border-blue-700/50 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Restaurant Dashboard. All rights reserved.
          </p>
          <p className="text-sm opacity-80">
            Built with ❤️ by Team
          </p>
        </div>
      </footer>
    </div>
  )
}
