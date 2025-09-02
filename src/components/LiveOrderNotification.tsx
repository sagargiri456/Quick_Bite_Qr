
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Notification {
  id: number;
  user_id: string | null;
  order_id: string | null;
  type: "new_order" | "order_ready" | "order_delayed";
  message: string;
  is_read: boolean;
  created_at: string; // ISO timestamp
}

export function LiveOrderNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch latest notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
      console.log("Fetched notifications:", data, error);

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data || []);
      setNotificationCount(data?.length || 0);
    }
  };

  // Dismiss a single notification
  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setNotificationCount((prev) => Math.max(0, prev - 1));

    // Optionally mark it as read in DB
    supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  // Dismiss all notifications
  const dismissAll = () => {
    setNotifications([]);
    setNotificationCount(0);

    // Optionally mark all as read
    supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications in real-time
    const channel = supabase
      .channel("live-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
          setNotificationCount((prev) => prev + 1);

          // Show panel temporarily
          setIsVisible(true);
          setTimeout(() => setIsVisible(false), 4500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-impressive transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 animate-pulse-slow" />
          <span className="font-semibold text-sm">Live Orders</span>
          {notificationCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 animate-bounce-in"
            >
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
              !notification.is_read ? "bg-blue-50/50 animate-glow" : ""
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
                      {new Date(notification.created_at).toLocaleTimeString()}
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
    </div>
  );
}
