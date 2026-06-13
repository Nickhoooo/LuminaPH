"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Import your icons here
import dashboard from "@/public/dashboard (1).png";
import lessons from "@/public/open-book.png";
import subjects from "@/public/graduate.png";
import leaderboard from "@/public/podium.png";
import setting from "@/public/setting.png";
import Image from "next/image";

export default function Sidebar() {
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
    <aside className="w-64 bg-white border-r border-gray-100 px-6 py-8 flex flex-col h-screen sticky top-0">
      
      {/* Logo */}
      <div className="font-serif text-2xl mb-8">
        Lumina<span className="text-emerald-500">PH</span>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Overview</p>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer
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
        </nav>
      </div>

      {/* Settings */}
      <div className="mb-auto">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Settings</p>
        <nav className="flex flex-col gap-2">
          {settingsItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer
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
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full text-left"
      >
        <span className="text-sm font-medium">Log Out</span>
      </button>

    </aside>
  );
}