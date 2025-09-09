'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, ChefHat, CheckCircle, XCircle, Utensils, Package, CreditCard, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { OrderItem, OrderItemStatus } from '@/app/dashboard/orders/LiveOrders';
import { setOrderStatus } from '@/lib/api/orders';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LiveOrdersComponentProps {
  fetchLiveOrders: () => Promise<void>;
  refreshing: boolean;
  liveOrders: OrderItem[] | null;
  filteredOrders: OrderItem[] | null;
  activeStatus: OrderItemStatus | 'All';
  setActiveStatus: (status: OrderItemStatus | 'All') => void;
  formatDate: (dateString: string) => string;
  getTotalPrice: (orders: OrderItem[] | null) => number;
  errorMsg?: string | null;
}

const ETA_PRESETS = [10, 15, 20, 25, 30];

const LiveOrdersComponent: React.FC<LiveOrdersComponentProps> = ({
  fetchLiveOrders,
  refreshing,
  liveOrders,
  filteredOrders,
  activeStatus,
  setActiveStatus,
  formatDate,
  getTotalPrice,
  errorMsg,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [etaChoice, setEtaChoice] = useState<Record<string, number>>({});

  const handleUpdate = async (orderId: string, status: OrderItemStatus, eta?: number | null) => {
    try {
      setUpdatingId(orderId);
      await setOrderStatus(orderId, status, eta ?? null);
      await fetchLiveOrders();
    } catch (e: unknown) {
      console.error('[update status]', e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to update status';
      alert(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'Preparing': return <ChefHat className="h-4 w-4" />;
      case 'Ready': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Cancelled': return 'destructive';
      case 'Confirmed':
      case 'Preparing':
      case 'Ready': return 'default';
      case 'Pending':
      default: return 'secondary';
    }
  };

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
              <Clock className="h-5 w-5 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Live Orders
              </span>
              <span className="text-4xl text-emerald-500 font-light mx-1">•</span>
              <span className="text-slate-500 font-medium text-sm tracking-wide align-middle">
                Real-time Updates
              </span>
            </h1>
          </div>
          <p className="text-[15px] text-slate-600 ml-11 font-normal tracking-wide font-sans">
            <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
              Manage and track all incoming orders in real-time
            </span>
          </p>
        </div>
        <Button 
          onClick={fetchLiveOrders} 
          disabled={refreshing} 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-slate-300 bg-white/90 backdrop-blur-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm opacity-90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition-colors">
                <Package className="h-4 w-4 text-slate-700" />
              </div>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300 font-sans tracking-tight">
              {liveOrders?.length || 0}
            </div>
            <p className="text-[13px] text-slate-500 mt-2 font-medium tracking-wide font-sans">All time orders</p>
          </CardContent>
        </Card>
        
        <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-colors">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 group-hover:scale-105 transition-transform duration-300">
              {liveOrders?.filter(o => o.status === 'Pending').length || 0}
            </div>
            <p className="text-[13px] text-slate-500 mt-2 font-medium tracking-wide font-sans">Awaiting confirmation</p>
          </CardContent>
        </Card>
        
        <Card className="group bg-white/90 backdrop-blur-md border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-colors">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 group-hover:scale-105 transition-transform duration-300">
              ₹{getTotalPrice(liveOrders).toFixed(2)}
            </div>
            <p className="text-[13px] text-slate-500 mt-2 font-medium tracking-wide font-sans">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeStatus} onValueChange={(v)=>setActiveStatus(v as OrderItemStatus|'All')} className="w-full">
        <TabsList className="w-full flex overflow-x-auto pb-1 mb-8 sm:mb-10 bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 rounded-xl shadow-sm border border-slate-200 font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger value="All" className="flex-1 min-w-[60px] sm:min-w-[80px] data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-slate-900 data-[state=active]:font-semibold font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-slate-200 h-9 font-sans">
            <span className="truncate">All</span>
          </TabsTrigger>
          <TabsTrigger value="Pending" className="flex-1 min-w-[80px] sm:min-w-[100px] data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-md font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-amber-100 h-9 font-sans">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Pending</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Confirmed" className="flex-1 min-w-[90px] sm:min-w-[110px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-blue-100 h-9 font-sans">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Confirmed</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Preparing" className="flex-1 min-w-[100px] sm:min-w-[120px] data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-md font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-purple-100 h-9 font-sans">
            <span className="flex items-center gap-1">
              <ChefHat className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Preparing</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Ready" className="flex-1 min-w-[70px] sm:min-w-[90px] data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-md font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-emerald-100 h-9 font-sans">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Ready</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <div>
          {filteredOrders && filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.order.id;
                const eta = etaChoice[order.order.id] ?? 15;
                return (
                  <Card key={order.id} className="group overflow-hidden border border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:shadow-slate-500/5 transition-all duration-500 hover:-translate-y-1 relative">
                    <div className={cn(
                      "absolute top-0 left-0 h-2 w-full rounded-t-lg",
                      order.status === 'Pending' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      order.status === 'Confirmed' ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                      order.status === 'Preparing' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                      order.status === 'Ready' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    )} />
                    
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="pb-3 sm:pb-4 relative z-10">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Order ID and Status Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                              <span className="text-slate-600 dark:text-slate-300">#</span>
                              <span className="text-white">{order.order.id.slice(-6)}</span>
                            </Badge>
                            <Link
                              href={`/restaurant/${order.order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}/orders/${order.order.track_code}`}
                              className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-colors group/link"
                              target="_blank"
                            >
                              <span className="hidden sm:inline">Order</span> #{order.order.track_code}
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-70 group-hover/link:opacity-100 transition-opacity">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </Link>
                            {order.order.table_number && (
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                <span className="hidden sm:inline">Table </span>#{order.order.table_number}
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant={getStatusVariant(order.status)} 
                            className={cn(
                              "px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold flex-shrink-0 rounded-full shadow-sm hover:shadow-md transition-all duration-300 w-fit",
                              order.status === 'Pending' && 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200',
                              order.status === 'Confirmed' && 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-200',
                              order.status === 'Preparing' && 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200',
                              order.status === 'Ready' && 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-200',
                              order.status === 'Cancelled' && 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200',
                              "group-hover:scale-105"
                            )}
                          >
                            <span className="flex items-center gap-1.5 sm:gap-2">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                        </div>
                        
                        {/* Restaurant and Payment Info Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Utensils className="h-3.5 w-3.5" />
                            {order.order.restaurant.name}
                          </span>
                          <span className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full"></span>
                          <span className="font-mono text-xs">{formatDate(order.created_at)}</span>
                          <span className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full"></span>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 w-fit",
                            order.order.is_prepaid 
                              ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          )}>
                            {order.order.is_prepaid ? 'Prepaid' : 'Pay on Table'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <Separator className="my-2" />
                    
                    <CardContent className="pt-4 sm:pt-6 pb-4 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition-colors">
                              <Utensils className="h-4 w-4 text-slate-700" />
                            </div>
                            <h3 className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-slate-700 transition-colors">
                              {order.menu_item?.name}
                            </h3>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                            <span className="flex items-center gap-2 font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
                              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                              Qty: {order.quantity}
                            </span>
                            <span className="hidden sm:block w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span className="font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full w-fit">
                              ₹{order.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-3 sm:p-4 rounded-xl border border-slate-200">
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                              ₹{(order.price * order.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-600 mt-1 font-medium">Total amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Order Actions */}
                      <div className="mt-4 sm:mt-6 pt-4 border-t border-gradient-to-r from-transparent via-border to-transparent">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                          <Button
                            size="sm"
                            variant={order.status === 'Pending' ? 'default' : 'outline'}
                            className={cn(
                              "h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none",
                              order.status === 'Pending' 
                                ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0" 
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-300"
                            )}
                            disabled={isUpdating || order.status !== 'Pending'}
                            onClick={() => handleUpdate(order.order.id, 'Confirmed')}
                          >
                            {isUpdating && order.status === 'Pending' ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Updating...
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Confirm Order</span>
                                <span className="sm:hidden">Confirm</span>
                              </div>
                            )}
                          </Button>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                            <select
                              className={cn(
                                "h-10 sm:h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-medium shadow-sm transition-all duration-300 flex-1 sm:flex-none",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                "hover:border-primary/50 hover:shadow-md"
                              )}
                              value={eta}
                              onChange={(e) => setEtaChoice((prev) => ({ ...prev, [order.order.id]: Number(e.target.value) }))}
                              disabled={isUpdating || (order.status !== 'Pending' && order.status !== 'Confirmed')}
                            >
                              {ETA_PRESETS.map((m) => (
                                <option key={m} value={m} className="text-sm">
                                  {m} min{m > 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                            <Button
                              size="sm"
                              variant={order.status === 'Preparing' ? 'default' : 'outline'}
                              className={cn(
                                "h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none",
                                order.status === 'Preparing' 
                                  ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0" 
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-300"
                              )}
                              disabled={isUpdating || (order.status !== 'Pending' && order.status !== 'Confirmed')}
                              onClick={() => handleUpdate(order.order.id, 'Preparing', eta)}
                            >
                              {isUpdating && order.status === 'Confirmed' ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Updating...
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <ChefHat className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Start Preparing ({eta}m)</span>
                                  <span className="sm:hidden">Preparing ({eta}m)</span>
                                </div>
                              )}
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant={order.status === 'Ready' ? 'default' : 'outline'}
                            className={cn(
                              "h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none",
                              order.status === 'Ready' 
                                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0" 
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-300"
                            )}
                            disabled={isUpdating || order.status !== 'Preparing'}
                            onClick={() => handleUpdate(order.order.id, 'Ready')}
                          >
                            {isUpdating ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Updating...
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Mark as Ready</span>
                                <span className="sm:hidden">Ready</span>
                              </div>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-10 sm:h-9 text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none sm:ml-auto"
                            disabled={isUpdating || order.status === 'Ready' || order.status === 'Cancelled'}
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this order?')) {
                                handleUpdate(order.order.id, 'Cancelled');
                              }
                            }}
                          >
                            {order.status === 'Cancelled' ? (
                              <div className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                Cancelled
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Cancel Order</span>
                                <span className="sm:hidden">Cancel</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 py-4 px-6 border-t border-slate-200">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <p className="text-xs text-slate-600 font-medium">
                              Last updated: {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-600 font-semibold">Live</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          <span className="text-xs text-slate-500 font-medium">#{order.order.id.slice(-4)}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-slate-300 p-12 bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="h-12 w-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">No orders found</h3>
              <p className="text-slate-600 max-w-md mx-auto text-lg leading-relaxed">
                {activeStatus === 'All'
                  ? "You don't have any active orders at the moment. New orders will appear here in real-time."
                  : `You don't have any orders with status "${activeStatus}".`}
              </p>
              {activeStatus !== 'All' && (
                <Button 
                  variant="outline" 
                  className="mt-6 bg-white border-slate-300 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setActiveStatus('All')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    View All Orders
                  </div>
                </Button>
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default LiveOrdersComponent;