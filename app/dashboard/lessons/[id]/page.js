"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import Link from "next/link";
import { BookOpen, CheckCircle2, AlertCircle, RotateCcw, ChevronLeft, Zap, Loader } from "lucide-react";

export default function SubjectLessonsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { } = useDashboard();
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingLessons, setGeneratingLessons] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState(null);
  const [user, setUser] = useState(null);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();
      setSubject(subject);

      const { data: existingLessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("subject_id", id)
        .order("order_number");

      if (existingLessons && existingLessons.length > 0) {
        const { data: progressData } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id);

        const lessonsWithProgress = existingLessons.map((lesson) => ({
          ...lesson,
          is_completed: progressData?.some(
            (p) => p.lesson_id === lesson.id && p.is_completed
          ),
        }));

        setLessons(lessonsWithProgress);
        checkSubjectStatus(existingLessons, progressData, user.id);
      } else {
        setGeneratingLessons(true);
        await generateLessons(subject, user.id);
        setGeneratingLessons(false);
      }

      setLoading(false);
    };

    getData();
  }, [id]);

  const checkSubjectStatus = async (lessons, progressData, userId) => {
    const lessonIds = lessons.map((l) => l.id);
    const { data: allProgress } = await supabase
      .from("progress")
      .select("*")
      .in("lesson_id", lessonIds)
      .eq("user_id", userId);

    const allPassed = lessons.every((lesson) =>
      allProgress?.some((p) => p.lesson_id === lesson.id && p.status === "passed")
    );

    const anyFailed = lessons.some((lesson) =>
      allProgress?.some((p) => p.lesson_id === lesson.id && p.status === "failed")
    );

    const status = allPassed ? "passed" : anyFailed ? "failed" : "in_progress";

    setSubjectProgress({
      status,
      allPassed,
      anyFailed,
      passedCount: allProgress?.filter((p) => p.status === "passed").length || 0,
      totalLessons: lessons.length,
    });
  };

  const generateLessons = async (subject, userId) => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;

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

      const data = await response.json();
      const { lessons } = data;

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
      isGeneratingRef.current = false;
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  const getDifficultyColor = (level) => {
    switch (level) {
      case "basic":
        return "from-emerald-400 to-emerald-600";
      case "intermediate":
        return "from-amber-400 to-amber-600";
      case "advanced":
        return "from-red-400 to-red-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const progressPercent = subjectProgress 
    ? Math.round((subjectProgress.passedCount / subjectProgress.totalLessons) * 100)
    : 0;

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-8 lg:mb-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">
              📚 Semester {subject?.semester || 1}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mt-2 mb-2">{subject?.title}</h1>
            <p className="text-sm lg:text-base text-gray-600">{subject?.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        {subjectProgress && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
                ${
                  subjectProgress.status === "passed"
                    ? "bg-emerald-100 text-emerald-700"
                    : subjectProgress.status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
            >
              {subjectProgress.status === "passed" && (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Completed!
                </>
              )}
              {subjectProgress.status === "failed" && (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Retake Required
                </>
              )}
              {subjectProgress.status === "in_progress" && (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  In Progress
                </>
              )}
            </div>

            {/* Progress Stats */}
            {subjectProgress && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {subjectProgress.passedCount}/{subjectProgress.totalLessons}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {subjectProgress && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5 lg:p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-emerald-900">Subject Progress</h3>
            <span className="text-2xl font-bold text-emerald-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-sm">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Lessons Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          <h2 className="text-lg lg:text-xl font-bold">Lessons</h2>
          <span className="ml-auto text-sm text-gray-500 font-medium">
            {lessons.length} lessons
          </span>
        </div>

        {generatingLessons ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 relative">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl animate-bounce">
                🤖
              </div>
            </div>
            <p className="text-base font-medium text-gray-900 mb-1">
              Creating your personalized lessons
            </p>
            <p className="text-sm text-gray-500">
              Your AI teacher is preparing everything for you...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <Link key={i} href={`/dashboard/lessons/${id}/${lesson.id}`}>
                <div
                  className={`flex items-center gap-4 p-4 lg:p-5 rounded-xl lg:rounded-2xl cursor-pointer transition-all border transform hover:scale-102 duration-200
                    ${
                      lesson.is_completed
                        ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-md"
                        : "bg-white border-gray-100 hover:border-emerald-300 hover:shadow-md"
                    }`}
                >
                  {/* Lesson Number */}
                  <div className="flex-shrink-0">
                    {lesson.is_completed ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {lesson.order_number}
                      </div>
                    )}
                  </div>

                  {/* Lesson Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm lg:text-base truncate ${
                      lesson.is_completed ? "text-emerald-700" : "text-gray-900"
                    }`}>
                      {lesson.title}
                    </p>
                  </div>

                  {/* Completed Badge */}
                  {lesson.is_completed && (
                    <div className="hidden sm:flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-semibold">Done</span>
                    </div>
                  )}

                  {/* Arrow */}
                  <ChevronLeft className="w-5 h-5 text-gray-300 flex-shrink-0 rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Retake Section */}
      {subjectProgress?.status === "failed" && (
        <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 lg:p-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg text-red-900 mb-1">
                Subject Not Completed
              </h3>
              <p className="text-sm text-red-700">
                You need to pass all lessons and retake the final quiz to complete this subject. Don't worry, you can try again!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              router.push(`/dashboard/lessons/${id}/${lessons[0].id}`);
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors mt-4"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Subject
          </button>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row">
    

        {lessons.length > 0 && (
          <Link href={`/dashboard/lessons/${id}/${lessons[0].id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors">
              Start Learning
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}