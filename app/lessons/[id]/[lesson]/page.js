"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LessonContent() {
  const router = useRouter();
  const { id, lesson: lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getData = async () => {
      // I-check kung may naka-login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Kunin yung profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      // Kunin yung subject
      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();
      setSubject(subject);

      // Kunin yung lesson
      const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
        setLesson(lesson);

      // I-check kung completed na
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
  }, [id, lessonId]);

  const markAsDone = async () => {
  if (completed || marking) return;
  setMarking(true);

  try {
    // I-save sa progress table
    await supabase
      .from("progress")
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      });

    // Mag-add ng XP — 10 XP per lesson
    const today = new Date().toISOString().split("T")[0]; // "2024-01-01"
    const lastActive = profile.last_active;

    // I-compute yung streak
    let newStreak = profile.streak || 0;

    if (!lastActive) {
      // First time nag-aral
      newStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActive === yesterdayStr) {
        // Nag-aral kahapon — dagdag ng streak!
        newStreak = newStreak + 1;
      } else if (lastActive === today) {
        // Nag-aral na today — hindi na dagdag
        newStreak = newStreak;
      } else {
        // Hindi nag-aral kahapon — reset!
        newStreak = 1;
      }
    }

    // I-update yung profile
    await supabase
      .from("profiles")
      .update({
        xp_points: profile.xp_points + 10,
        streak: newStreak,
        last_active: today,
      })
      .eq("id", user.id);

    setCompleted(true);

  } catch (error) {
    console.error("Error marking as done:", error);
  } finally {
    setMarking(false);
  }
};

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF5EB] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF5EB]">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="font-serif text-xl cursor-pointer">
            Lumina<span className="text-orange-500">PH</span>
          </div>
        </Link>
        <Link href={`/lessons/${id}`}>
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back to Lessons
          </button>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
          <span>→</span>
          <Link href={`/lessons/${id}`} className="hover:text-orange-400">{subject?.title}</Link>
          <span>→</span>
          <span className="text-gray-600">{lesson?.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="text-xs text-orange-400 font-medium uppercase tracking-widest mb-2">
            Lesson {lesson?.order_number}
          </div>
          <h1 className="text-3xl font-serif mb-2">{lesson?.title}</h1>
        </div>

        {/* Lesson Content */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="prose text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {lesson?.content}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={markAsDone}
            disabled={completed || marking}
            className={`flex-1 text-white text-sm py-3 rounded-xl transition-all
              ${completed
                ? "bg-green-400 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500"
              }`}
          >
            {marking ? "Saving..." : completed ? "✅ Completed!" : "✅ Mark as Done"}
          </button>
          <Link href={`/ai-chat/${id}`} className="flex-1">
            <button className="w-full border border-orange-400 text-orange-400 text-sm py-3 rounded-xl hover:bg-orange-50">
              🤖 Ask AI Teacher
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}