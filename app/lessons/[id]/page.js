"use client";
import { useEffect, useState, useRef} from "react";
import { useRouter, useParams} from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LessonPage() {
  const router = useRouter();
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingLessons, setGeneratingLessons] = useState(false);
  const isGeneratingRef = useRef(false); 

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Kunin yung subject
      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();
      setSubject(subject);

      // Kunin yung existing lessons
      const { data: existingLessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("subject_id", id)
        .order("order_number");

        console.log("Existing lessons count:", existingLessons?.length);

      if (existingLessons && existingLessons.length > 0) {
        // Kunin yung progress
        console.log("May lessons na — hindi na mag-ge-generate!");
        const { data: progressData } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id);
        

        // I-combine lessons + progress
        const lessonsWithProgress = existingLessons.map((lesson) => ({
          ...lesson,
          is_completed: progressData?.some(
            (p) => p.lesson_id === lesson.id && p.is_completed
          ),
        }));

        setLessons(lessonsWithProgress);
      } else {
        console.log("Wala pang lessons — mag-ge-generate!");
        // Wala pang lessons — mag-generate!
        setGeneratingLessons(true);
        await generateLessons(subject, user.id);
        setGeneratingLessons(false);
      }

      setLoading(false);
    };

    getData();
  }, [id]);

  const generateLessons = async (subject, userId) => {
  if (isGeneratingRef.current) return; // ← kung nag-ge-generate na — stop!
  isGeneratingRef.current = true; // ← i-mark na nag-ge-generate na

  try {
    const response = await fetch("/api/generate-lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_title: subject.title,
        subject_description: subject.description,
        difficulty_level: subject.difficulty_level,
      }),
    });

    const { lessons } = await response.json();

    const lessonsToInsert = lessons.map((lesson, index) => ({
      ...lesson,
      subject_id: id,
      order_number: index + 1,
    }));

    const { data: savedLessons } = await supabase
      .from("lessons")
      .insert(lessonsToInsert)
      .select();

    setLessons(savedLessons);

  } catch (error) {
    console.error("Error generating lessons:", error);
  } finally {
    isGeneratingRef.current = false; // ← i-reset after
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
        <Link href="/dashboard">
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back to Dashboard
          </button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Subject Header */}
        <div className="mb-8">
          <span className="text-xs text-orange-400 font-medium uppercase tracking-widest">
            {subject?.difficulty_level}
          </span>
          <h1 className="text-3xl font-serif mt-1 mb-2">{subject?.title}</h1>
          <p className="text-sm text-gray-400 font-light">{subject?.description}</p>
        </div>

        {/* Lessons List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-medium mb-4">Lessons</h2>

          {generatingLessons ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-3xl mb-3">🤖</span>
              <p className="text-sm text-gray-400 font-light">
                Your AI teacher is preparing your lessons...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lessons.map((lesson, i) => (
                <Link key={i} href={`/lessons/${id}/${lesson.id}`}>
                  <div className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                    ${lesson.is_completed
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-gray-50 hover:bg-orange-50"
                    }`}>
                    
                    {/* Lesson Number or Check */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${lesson.is_completed
                        ? "bg-green-400 text-white"
                        : "bg-orange-100 text-orange-500"
                      }`}>
                      {lesson.is_completed ? "✓" : lesson.order_number}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                    </div>

                    {/* Status badge */}
                    {lesson.is_completed && (
                      <span className="text-xs bg-green-100 text-green-500 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}

                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}