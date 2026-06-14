"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import { Bell, X, Archive } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { profile } = useDashboard();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchNotifications = async () => {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("type", activeTab);
      }

      const { data } = await query;
      setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();
  }, [profile?.id, activeTab]);

  const markAllAsRead = async () => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", profile.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", profile.id);

    setNotifications([]);
  };

  const dismissOne = async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "achievement", label: "Achievements" },
    { id: "learning", label: "Learning" },
    { id: "social", label: "Social" },
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-7 h-7 text-emerald-500 shrink-0" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Notifications</h1>
            </div>
            <p className="text-sm text-gray-600">
              Stay updated with your learning progress
            </p>
          </div>

          {/* Action buttons — live in header on all sizes */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors whitespace-nowrap"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Archive className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base text-gray-600 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 sm:gap-4 px-4 py-4 sm:px-6 sm:py-5 hover:bg-gray-50 transition-colors ${
                  !notif.read ? "bg-blue-50 hover:bg-blue-100/60" : ""
                }`}
              >
                {/* Unread dot */}
                <div className="mt-2 shrink-0">
                  {!notif.read ? (
                    <span className="block w-2 h-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="block w-2 h-2" />
                  )}
                </div>

                {/* Icon */}
                <span className="text-xl sm:text-2xl shrink-0 mt-0.5">
                  {notif.icon || "📌"}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link href={notif.action_url || "#"}>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-emerald-600 leading-snug">
                      {notif.title}
                    </h3>
                  </Link>
                  {notif.message && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => dismissOne(notif.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}