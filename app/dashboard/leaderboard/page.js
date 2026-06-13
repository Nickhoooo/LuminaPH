"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Zap, Crown, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("xp_points", { ascending: false });

      setUsers(profiles || []);
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-transparent flex items-center justify-center py-10">
        <p className="text-sm text-gray-400">Loading...</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-12">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl lg:text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-sm lg:text-base text-gray-600">Compete with Filipino students and earn your spot! </p>
        </div>

        {/* Top 3 - Hidden on mobile */}
        <div className="hidden md:flex items-end justify-center gap-2 lg:gap-6 mb-12">
          {/* 2nd place */}
          {users[1] && (
            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-lg lg:text-2xl font-bold text-emerald-600 mb-3 border-2 border-emerald-200">
                {users[1].name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 text-center w-28 lg:w-32 shadow-lg hover:shadow-xl transition-all">
                <p className="text-4xl mb-2">🥈</p>
                <p className="text-sm font-bold truncate">{users[1].name}</p>
                <div className="flex items-center justify-center gap-1 mt-2 bg-emerald-50 rounded-lg py-1">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-emerald-600">{users[1].xp_points}</p>
                </div>
              </div>
            </div>
          )}

          {/* 1st place - CHAMPION */}
          {users[0] && (
            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center gap-1">
                <Crown className="w-6 lg:w-8 h-6 lg:h-8 text-emerald-500" />
              </div>
              <div className="w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold text-white mb-3 border-4 border-emerald-300 shadow-2xl animate-pulse">
                {users[0].name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-center w-32 lg:w-40 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
                <p className="text-5xl mb-2">🥇</p>
                <p className="text-sm font-bold">{users[0].name}</p>
                <div className="flex items-center justify-center gap-1 mt-2 bg-white bg-opacity-20 rounded-lg py-1">
                  <Zap className="w-4 h-4" />
                  <p className="text-xs font-bold">{users[0].xp_points} XP</p>
                </div>
              </div>
            </div>
          )}

          {/* 3rd place */}
          {users[2] && (
            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: "0.4s" }}>
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-lg lg:text-2xl font-bold text-emerald-600 mb-3 border-2 border-emerald-200">
                {users[2].name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 text-center w-28 lg:w-32 shadow-lg hover:shadow-xl transition-all">
                <p className="text-4xl mb-2">🥉</p>
                <p className="text-sm font-bold truncate">{users[2].name}</p>
                <div className="flex items-center justify-center gap-1 mt-2 bg-emerald-50 rounded-lg py-1">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-emerald-600">{users[2].xp_points}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full List */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 lg:px-6 py-4 border-b border-emerald-200">
            <h2 className="text-base lg:text-lg font-bold text-emerald-900">All Students</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {users.map((user, i) => {
              const isMe = user.id === currentUser?.id;
              const isTopThree = i < 3;
              
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 transition-all hover:bg-emerald-50 cursor-pointer ${
                    isMe ? "bg-emerald-50 border-l-4 border-emerald-500" : ""
                  }`}
                >
                  
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isTopThree ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md ${
                      isTopThree
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                        : isMe
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-base font-bold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.course} · Year {user.year_level}</p>
                  </div>

                  {/* Streak */}
                  {user.streak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-lg flex-shrink-0">
                      <span className="text-xs">🔥</span>
                      <p className="text-xs font-bold text-amber-700">{user.streak}</p>
                    </div>
                  )}

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-lg">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm lg:text-base font-bold text-emerald-600">{user.xp_points}</p>
                    </div>
                  </div>

                  {/* You Badge */}
                  {isMe && (
                    <div className="hidden sm:block px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold">
                      You
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}