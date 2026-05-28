import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Search from "@/public/search.png"; 
import notification from "@/public/notification.png";
import Message from "@/public/chatting.png";
import Profile from "@/public/bussiness-man (1).png"
import Link from "next/link";

export default function Navbar({ profile }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };



  return (
    <nav className="flex items-center justify-between mb-6">
      
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 w-100 shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
        <Image src={Search} className="w-6"></Image>
        <input
          type="text"
          placeholder="Search Your Course"
          className="text-sm outline-none w-full text-gray-600"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            <Image src={notification} className="w-5" alt="NotifIcon"></Image>
        </div>

        {/* Message */}
       <Link href="/chat">
  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-orange-50 cursor-pointer">
    <Image src={Message} className="w-5" alt="ChatIcon"></Image>
  </div>
</Link>
        {/* Divider */}
        <div className="w-px h-10 bg-black ml-3.5" />

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xs font-medium shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            <Image src={Profile} className="" alt="ProfileIcon"></Image>
          </div>
          <span className="text-sm font-medium text-gray-700">{profile?.name}</span>
        </div>
      </div>

    </nav>
  );
}