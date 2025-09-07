// src/app/dashboard/orderhistory/page.tsx

import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, CircleDollarSign, AlertCircle, History, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the type for our orders directly in this file
type HistoricalOrder = {
  id: string;
  track_code: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'complete' | 'cancelled';
  total_amount: number;
};

// Helper functions can be defined at the top level
const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'complete': return 'default';
        case 'cancelled': return 'destructive';
        default: return 'secondary';
    }
};

// This is an async Server Component
export default async function OrderHistoryPage() {
  const supabase = await createServerClient();

  // 1. Get the authenticated user (server-side)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login'); // Redirect if not logged in
  }

  // 2. Find the user's restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (restaurantError || !restaurant) {
    return (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg m-4">
            <AlertCircle className="inline-block mr-2" />
            Error: Could not find a restaurant associated with your account.
        </div>
    );
  }

  // 3. Fetch all orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at, track_code")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
     return (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg m-4">
            <AlertCircle className="inline-block mr-2" />
            Error: {ordersError.message}
        </div>
    );
  }
  
  // 4. Render the UI
  return (
    <div className="w-full">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
            <History className="h-5 w-5 text-slate-700" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Order History
            </span>
            <span className="text-4xl text-slate-400 font-light mx-1">•</span>
            <span className="text-slate-500 font-medium text-sm tracking-wide align-middle">
              Past Transactions
            </span>
          </h1>
        </div>
        <p className="text-[15px] text-slate-600 ml-12 font-normal tracking-wide font-sans">
            <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
              Review and manage your completed and cancelled orders
            </span>
        </p>
      </div>
      
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {(orders as HistoricalOrder[]).map((order, index) => (
            <Card key={order.id} className="group overflow-hidden border border-slate-200 bg-white/95 backdrop-blur-sm hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-0.5 relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Status indicator bar */}
              <div className={cn(
                "absolute top-0 left-0 h-2 w-full",
                order.status === 'complete' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              )} />
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
                  <div className="space-y-3 sm:space-y-4 w-full">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-300 flex-shrink-0">
                        <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-sans text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block truncate tracking-tight">
                          {order.track_code}
                        </span>
                        <p className="text-[13px] text-slate-500 font-medium mt-1 tracking-wide font-sans">Order ID</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5 font-medium sm:font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate font-medium text-[13px]">{formatTime(order.created_at)}</span>
                      </span>
                      <span className="hidden sm:inline-block w-1 h-1 bg-slate-400 rounded-full"></span>
                      <span className="font-sans text-slate-600 bg-slate-50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[13px] sm:text-[14px] whitespace-nowrap font-medium">
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={getStatusVariant(order.status)} 
                    className={cn(
                      "px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 whitespace-nowrap tracking-wide",
                      order.status === 'complete' 
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-100 hover:border-emerald-200'
                        : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-100 hover:border-red-200'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {order.status === 'complete' ? (
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      )}
                      <span className="hidden sm:inline">{order.status}</span>
                      <span className="sm:hidden">{order.status === 'complete' ? 'Done' : 'Cancelled'}</span>
                    </span>
                  </Badge>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-3 sm:my-4"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-600 tracking-wide font-sans">Total Amount</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[13px] text-slate-500 font-medium tracking-wide font-sans">Paid via Card</span>
                  </div>
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-3 sm:p-4 rounded-xl border border-slate-200 w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200 transition-colors flex-shrink-0 border border-emerald-100">
                        <CircleDollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-display tracking-tight">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                        <p className="text-[13px] text-slate-500 mt-1 font-medium tracking-wide font-sans">Final amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 py-3 sm:py-4 px-4 sm:px-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <p className="text-xs text-slate-600 font-medium truncate">
                        {new Date(order.created_at).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-emerald-600 font-semibold whitespace-nowrap">
                        {order.status === 'complete' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <div className="w-2 h-2 bg-slate-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-slate-500 font-medium">#{order.id.slice(-4)}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-24 rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-14 bg-gradient-to-br from-slate-50 to-slate-75">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
            <History className="h-10 w-10 sm:h-14 sm:w-14 text-slate-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 font-sans">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              No Orders Found
            </span>
          </h3>
          <p className="text-slate-600 max-w-md mx-auto text-[15px] sm:text-[16px] leading-relaxed font-normal tracking-wide font-sans">
            There are no orders in your history yet. Completed orders will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

