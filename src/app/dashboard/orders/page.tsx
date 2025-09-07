// src/app/dashboard/orders/page.tsx
import React from 'react';
import LiveOrders from './LiveOrders';
import OrderHistory from './OrderHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, History, TrendingUp, Activity } from 'lucide-react';

export default function Orders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Enhanced Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
              <Activity className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Orders Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Monitor live orders and browse historical activity in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    Live Orders
                  </p>
                  <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Active</p>
                  <p className="text-xs text-slate-500 font-medium">Real-time monitoring</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                  <Clock className="h-7 w-7 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    Order History
                  </p>
                  <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Complete</p>
                  <p className="text-xs text-slate-500 font-medium">Historical data</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                  <History className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    Performance
                  </p>
                  <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Real-time</p>
                  <p className="text-xs text-slate-500 font-medium">Live analytics</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-8 bg-slate-200" />

        {/* Enhanced Content grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Live Orders */}
          <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <CardHeader className="pb-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg border-b border-slate-200">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                  <Clock className="h-6 w-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <span className="text-slate-900">Live Orders</span>
                  <p className="text-sm text-slate-600 font-normal">Real-time order management</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-600 font-semibold">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[75vh] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                <div className="p-6">
                  <LiveOrders />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <CardHeader className="pb-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-t-lg border-b border-emerald-200">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                  <History className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <span className="text-slate-900">Order History</span>
                  <p className="text-sm text-slate-600 font-normal">Completed order records</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-emerald-600 font-semibold">Archive</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[75vh] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                <div className="p-6">
                  <OrderHistory />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
