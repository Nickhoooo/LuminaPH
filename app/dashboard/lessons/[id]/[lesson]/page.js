"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, BookOpen, MessageSquare, Zap, Flame, Award } from "lucide-react";

export default function LessonContent() {
  const router = useRouter();
  const { id, lesson: lessonId } = useParams();
  const { profile: dashboardProfile } = useDashboard();
  const [lesson, setLesson] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      setProfile(dashboardProfile);

      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();
      setSubject(subject);

      const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      setLesson(lesson);

      const { data: progress } = await supabase
        .from("progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (progress?.is_completed) {
        setCompleted(true);
      }

      setLoading(false);
    };

    getData();
  }, [id, lessonId, dashboardProfile]);

  const markAsDone = async () => {
    if (completed || marking || !profile) return;
    setMarking(true);

    try {
      await supabase.from("progress").insert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      });

      const today = new Date().toISOString().split("T")[0];
      const lastActive = profile.last_active;

      let newStreak = profile.streak || 0;

      if (!lastActive) {
        newStreak = 1;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastActive === yesterdayStr) {
          newStreak = newStreak + 1;
        } else if (lastActive === today) {
          newStreak = newStreak;
        } else {
          newStreak = 1;
        }
      }

      await supabase.from("profiles").update({
        xp_points: profile.xp_points + 10,
        streak: newStreak,
        last_active: today,
      }).eq("id", user.id);

      setProfile({
        ...profile,
        xp_points: profile.xp_points + 10,
        streak: newStreak,
        last_active: today,
      });

      setCompleted(true);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    } catch (error) {
      console.error("Error marking as done:", error);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header Section */}
      <div className="mb-8">
        <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          {subject?.title} • Lesson {lesson?.order_number}
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{lesson?.title}</h1>
          </div>
          
          {completed && (
            <div className="flex-shrink-0 flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
              <CheckCircle2 className="w-5 h-5" />
              <span className="hidden sm:inline">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* XP Reward Badge */}
      {!completed && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 lg:p-5 mb-6 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">Complete this lesson</p>
            <p className="text-xs text-amber-700">Earn +10 XP when you mark it as done</p>
          </div>
        </div>
      )}

      {/* Reward Popup */}
      {showReward && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <Award className="w-5 h-5" />
          <span className="font-semibold">+10 XP earned!</span>
        </div>
      )}

      {/* Lesson Content */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-10 mb-8 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base lg:text-lg font-light">
            {lesson?.content}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {/* Mark as Done */}
        <button
          onClick={markAsDone}
          disabled={completed || marking}
          className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95
            ${
              completed
                ? "bg-emerald-100 text-emerald-700 cursor-default hover:scale-100"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg"
            }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{marking ? "Saving..." : completed ? "Done!" : "Mark Done"}</span>
        </button>

        {/* Take Quiz */}
        <Link href={`/dashboard/quiz/${lessonId}`}>
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Take Quiz</span>
            <span className="sm:hidden">Quiz</span>
          </button>
        </Link>

        {/* Ask AI Teacher */}
        <Link href={`/dashboard/ai-chat/${id}`}>
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-xl font-semibold hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="sm:hidden">Ask AI</span>
          </button>
        </Link>
      </div>

      {/* Stats Section */}
      {profile && (
        <div className="bg-gradient-to-r from-emerald-50 via-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 lg:p-8">
          <h3 className="text-sm font-bold text-emerald-900 mb-4">Your Progress</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total XP */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Total XP</p>
                <p className="text-2xl font-bold text-emerald-600">{profile.xp_points}</p>
              </div>
            </div>

            {/* Streak */}
            {profile.streak > 0 && (
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-amber-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Streak</p>
                  <p className="text-2xl font-bold text-amber-600">{profile.streak} 🔥</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                {completed ? <CheckCircle2 className="w-6 h-6" /> : <Award className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Status</p>
                <p className={`text-2xl font-bold ${completed ? "text-green-600" : "text-blue-600"}`}>
                  {completed ? "Done" : "Active"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>

        <Link href={`/dashboard/lessons/${id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors">
            View All Lessons
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </Link>
      </div>
    </div>
  );
}