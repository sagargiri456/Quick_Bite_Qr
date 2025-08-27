"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: "new_order" | "order_ready" | "order_delayed";
  time: string;
  isNew: boolean;
}

export function LiveOrderNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const generateLiveOrder = (): Notification => {
    const types: ("new_order" | "order_ready" | "order_delayed")[] = ["new_order", "order_ready", "order_delayed"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const messages = {
      new_order: `New order #${Math.floor(Math.random() * 1000) + 100} received`,
      order_ready: `Order #${Math.floor(Math.random() * 1000) + 100} is ready for pickup`,
      order_delayed: `Order #${Math.floor(Math.random() * 1000) + 100} is running behind schedule`
    };

    return {
      id: Date.now().toString(),
      message: messages[type],
      type,
      time: new Date().toLocaleTimeString(),
      isNew: true
    };
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const dismissAll = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    const showNotification = () => {
      // Clear any existing hide timer
      if (hideTimer) clearTimeout(hideTimer);
      
      // Generate new notification
      const newNotification = generateLiveOrder();
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      setNotificationCount(prev => prev + 1);
      
      // Show the notification panel with animation
      setIsVisible(true);
      
      // Start fade out animation after 4.5 seconds
      hideTimer = setTimeout(() => {
        setIsVisible(false);
        // Remove the notification from the list after animation completes
        setTimeout(() => {
          setNotifications(prev => prev.slice(0, -1));
          setNotificationCount(prev => Math.max(0, prev - 1));
        }, 300); // Match this with the CSS transition duration
      }, 4500);
    };

    // Initial setup
    const init = () => {
      // Show first notification immediately
      showNotification();
      
      // Set up interval for subsequent notifications (every 10 seconds)
      interval = setInterval(showNotification, 10000);
    };

    // Start the notification cycle
    init();

    // Cleanup function
    return () => {
      clearTimeout(hideTimer);
      clearInterval(interval);
      setIsVisible(false);
    };
  }, []);
  
  // Don't render anything if there are no notifications
  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-4 left-4 z-50 w-80 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-impressive transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 animate-pulse-slow" />
          <span className="font-semibold text-sm">Live Orders</span>
          {notificationCount > 0 && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-bounce-in">
              {notificationCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismissAll}
          className="h-6 w-6 p-0 text-white hover:bg-white/20"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border-b border-gray-100 last:border-b-0 ${
              notification.isNew ? "bg-blue-50/50 animate-glow" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {notification.type === "new_order" && (
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                )}
                {notification.type === "order_ready" && (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                )}
                {notification.type === "order_delayed" && (
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Real-time order updates
        </p>
      </div>
    </div>
  );
}
