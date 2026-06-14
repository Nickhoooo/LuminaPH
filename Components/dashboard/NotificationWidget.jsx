"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, X, CheckCircle2, Award, BookOpen, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NotificationWidget({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      setNotifications(data || []);
      const unread = (data || []).filter((n) => !n.read).length;
      setUnreadCount(unread);
    };

    fetchNotifications();

    // Real-time subscription
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev.slice(0, 4)]);
          setUnreadCount((prev) => prev + 1);
          
          // Show toast
          showNotificationToast(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notifId) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notifId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const deleteNotification = async (notifId) => {
    await supabase
      .from("notifications")
      .delete()
      .eq("id", notifId);

    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const getIcon = (type) => {
    switch (type) {
      case "achievement":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "learning":
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case "social":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const showNotificationToast = (notif) => {
    // This would show a toast - for now just visual feedback
    console.log("New notification:", notif);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden md:max-h-96 md:overflow-y-auto flex flex-col w-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors ${
                    !notif.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">{getIcon(notif.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link href={notif.action_url || "#"}>
                        <p className="text-sm font-semibold text-gray-900 hover:text-emerald-600 truncate">
                          {notif.title}
                        </p>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTimeAgo(notif.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 hover:bg-emerald-100 rounded text-xs text-emerald-600 font-bold"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <Link href="/dashboard/notifications">
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-center hover:bg-gray-100 transition-colors">
                <p className="text-sm font-semibold text-emerald-600">View All →</p>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}