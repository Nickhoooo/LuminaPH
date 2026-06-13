import Link from "next/link";
import { Zap, Flame, Target, MessageSquare, ChevronRight } from "lucide-react";

export default function RightPanel({ profile, subjects }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const incompleteSubjects = subjects?.filter(
    (s) => s.progress < 100
  ).slice(0, 3) || [];

  return (
    <aside className="w-90 bg-white border-l border-gray-100 px-6 py-8 flex flex-col gap-6 self-start sticky top-0 h-screen overflow-y-auto">

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Profile</p>

        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg mx-auto">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">
          {getGreeting()} 
        </p>

        <p className="text-sm font-bold text-gray-900">{profile?.name}</p>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          Continue your learning to achieve your target!
        </p>

        <div className="mt-4 inline-flex items-center gap-2 bg-white text-emerald-600 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-200">
          {profile?.course} · {profile?.year_level}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-white rounded-lg p-2 border border-emerald-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-emerald-500" />
              <p className="text-xs text-gray-600">XP</p>
            </div>
            <p className="text-lg font-bold text-emerald-600">{profile?.xp_points || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-amber-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <p className="text-xs text-gray-600">Streak</p>
            </div>
            <p className="text-lg font-bold text-amber-600">{profile?.streak || 0}</p>
          </div>
        </div>
      </div>

      {/* Daily Goal */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-emerald-500" />
          <p className="text-sm font-bold text-gray-900">Daily Goal</p>
        </div>

        {incompleteSubjects.length === 0 ? (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-sm font-semibold text-emerald-700">
              All subjects completed!
            </p>
            <p className="text-xs text-emerald-600 mt-1">Amazing work today! 🚀</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {incompleteSubjects.map((subject, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-3 hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-base mt-0.5 flex-shrink-0">📖</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{subject.title}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{subject.progress}% done</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/lessons/${subject.id}`}>
                    <button className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-all transform group-hover:scale-105 active:scale-95 flex items-center gap-1 flex-shrink-0">
                      <span className="hidden sm:inline">View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/dashboard/subjects">
          <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-all transform hover:shadow-md active:scale-95">
            See All Subjects →
          </button>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* AI Chat Prompt */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">AI Teacher</p>
        </div>
        <p className="text-sm text-blue-700 font-medium mb-3">
          Need help? Chat with your AI teacher anytime!
        </p>
        <p className="text-xs text-blue-600">
          📱 Tap the floating button below to start
        </p>
      </div>

    </aside>
  );
}