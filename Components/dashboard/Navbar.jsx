"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageSquare, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import notification from "@/public/notification.png";
import NotificationWidget from "./NotificationWidget";

// Icons
import dashboard from "@/public/dashboard (1).png";
import lessons from "@/public/open-book.png";
import subjects from "@/public/graduate.png";
import leaderboard from "@/public/podium.png";
import setting from "@/public/setting.png";

export default function Navbar({ profile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", icon: dashboard, href: "/dashboard" },
    { label: "Lessons", icon: lessons, href: "/dashboard/lessons" },
    { label: "Subjects", icon: subjects, href: "/dashboard/subjects" },
    { label: "Leaderboard", icon: leaderboard, href: "/dashboard/leaderboard" },
  ];

  const settingsItems = [
    { label: "Certificates", icon: setting, href: "/dashboard/certificates" },
    { label: "Setting", icon: setting, href: "/dashboard/settings" },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 lg:px-8 py-5 border-b border-gray-100 bg-white relative">
        
        {/* Hamburger - Mobile Only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1" />

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            <NotificationWidget userId={profile?.id} />
            
            {/* Existing notification code */}
        
            
            {/* Rest of navbar */}
        </div>

          {/* Message */}
          <Link href="/dashboard/chat">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-green-50 cursor-pointer">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </div>
          </Link>

          {/* Divider - Hidden on mobile */}
          <div className="w-px h-10 bg-black ml-3.5 hidden sm:block" />

          {/* User - Hidden on small mobile */}
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 text-xs font-medium shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{profile?.name}</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-2">
            
            {/* Overview Section */}
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Overview</p>
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive(item.href)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                >
                  <Image src={item.icon} alt={item.label} className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}

            {/* Settings Section */}
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-4 mb-2">Settings</p>
            {settingsItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive(item.href)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                >
                  <Image src={item.icon} alt={item.label} className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full text-left mt-4"
            >
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}