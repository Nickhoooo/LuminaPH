"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import DashboardIcon from "@/public/dashboard.png";
import book from "@/public/book.png";
import education from "@/public/education.png";
import leaderboard from "@/public/podium.png";
import logout from "@/public/logout (1).png";
import setting from "@/public/setting.png";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon, href: "/dashboard" },
  { label: "Subjects", icon: education, href: "/subjects" },
  { label: "Lesson", icon: book, href: "/lessons" },
  { label: "Leaderboard", icon: leaderboard, href: "/leaderboard" },
];

const settingsItems = [
  { label: "Setting", icon: setting, href: "/settings" },
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-100 min-h-screen px-4 py-6 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="font-poppins text-[25px] px-2 font-bold pl-9 mb-[50px] mt-[30px]">
          Lumina<span className="text-orange-500">PH</span>
        </div>

        {/* Overview */}
        <p className="text-xs text-gray-400 px-2 mb-2">Overview</p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 cursor-pointer transition-all">
                <Image src={item.icon} alt={item.label} width={18} height={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Settings */}
      <div>
        <p className="text-xs text-gray-400 px-2 mb-2">Settings</p>

        <nav className="flex flex-col gap-1">
          {settingsItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 cursor-pointer transition-all">
                <Image src={item.icon} alt={item.label} width={18} height={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-all w-full"
          >
            <Image src={logout} alt="logout" width={18} height={18} />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

    </aside>
  );
}