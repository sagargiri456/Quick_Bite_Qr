import React from "react";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface RecentOrdersProps {
  dateRange?: DateRange;
}

export function RecentOrders({ dateRange }: RecentOrdersProps) {
  console.log('RecentOrders component rendered, dateRange:', dateRange);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-600 mb-2">Recent Orders</h3>
        <p className="text-sm sm:text-base text-gray-600">Latest customer orders and their status</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Order 1 - John Smith */}
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=John Smith`} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs sm:text-sm">JS</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">John Smith</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">john.smith@email.com</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-blue-600">$45.99</p>
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 text-xs">
                        Ready
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200 text-xs">
                      Dine-in
                    </Badge>
                    <span className="text-xs text-gray-500">Today at 12:30 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/beef-burger.jpg" 
                        alt="Beef Burger"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/caesar-salad.jpg" 
                        alt="Caesar Salad"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/chicken-alfredo.jpg" 
                        alt="Chicken Alfredo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order 2 - Sarah Johnson */}
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=Sarah Johnson`} />
                  <AvatarFallback className="bg-green-600 text-white font-semibold text-xs sm:text-sm">SJ</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">Sarah Johnson</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">sarah.j@email.com</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-blue-600">$32.50</p>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 text-xs">
                        Preparing
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200 text-xs">
                      Takeout
                    </Badge>
                    <span className="text-xs text-gray-500">Today at 1:15 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/pizza.jpg" 
                        alt="Margherita Pizza"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/caesar-salad.jpg" 
                        alt="Caesar Salad"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order 3 - Mike Davis */}
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=Mike Davis`} />
                  <AvatarFallback className="bg-purple-600 text-white font-semibold text-xs sm:text-sm">MD</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">Mike Davis</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">mike.davis@email.com</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-blue-600">$67.25</p>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200 text-xs">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-700 border-cyan-200 text-xs">
                      Delivery
                    </Badge>
                    <span className="text-xs text-gray-500">Today at 2:00 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/grilled-salmon.jpg" 
                        alt="Grilled Salmon"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/gourmet-dishes.jpg" 
                        alt="Gourmet Side"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order 4 - Emily Wilson */}
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=Emily Wilson`} />
                  <AvatarFallback className="bg-pink-600 text-white font-semibold text-xs sm:text-sm">EW</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">Emily Wilson</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">emily.w@email.com</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-blue-600">$28.99</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-xs">
                        Delivered
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200 text-xs">
                      Dine-in
                    </Badge>
                    <span className="text-xs text-gray-500">Today at 2:45 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/chicken-alfredo.jpg" 
                        alt="Chicken Alfredo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/beef-burger.jpg" 
                        alt="Beef Burger"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order 5 - David Brown */}
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=David Brown`} />
                  <AvatarFallback className="bg-red-600 text-white font-semibold text-xs sm:text-sm">DB</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">David Brown</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">david.brown@email.com</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-red-600">$0.00</p>
                      <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200 text-xs">
                        Cancelled
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200 text-xs">
                      Takeout
                    </Badge>
                    <span className="text-xs text-gray-500">Today at 3:30 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/gourmet-dishes.jpg" 
                        alt="Chef's Special"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <Image 
                        src="/pizza.jpg" 
                        alt="Pizza"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Info:</strong> Component is rendering with {dateRange ? 'date range' : 'no date range'}
          </p>
        </div>
      </div>
    </div>
  );
}