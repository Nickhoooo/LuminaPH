"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useDashboard } from "@/lib/DashboardContext";
import { BookOpen, CheckCircle2, ArrowRight, ChevronLeft } from "lucide-react";

export default function LessonsOverview() {
  const router = useRouter();
  const { subjects } = useDashboard();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      if (!subjects || subjects.length === 0) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const subjectIds = subjects.map((s) => s.id);
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("*, subjects(title)")
        .in("subject_id", subjectIds)
        .order("order_number");

      const { data: progressData } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", true);

      const lessonsWithProgress = allLessons?.map((lesson) => ({
        ...lesson,
        is_completed: progressData?.some((p) => p.lesson_id === lesson.id),
      }));

      setLessons(lessonsWithProgress || []);
      setLoading(false);
    };

    getData();
  }, [subjects]);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  const completedCount = lessons.filter((l) => l.is_completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 lg:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl lg:text-4xl font-bold">My Lessons</h1>
        </div>
        <p className="text-sm lg:text-base text-gray-600">
          All your lessons across all subjects, in one place
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 lg:p-12 text-center">
          <span className="text-6xl mb-4 block">📚</span>
          <p className="text-base lg:text-lg text-gray-600 font-medium mb-2">
            No lessons yet
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Go to your subjects to start learning!
          </p>
          <Link href="/dashboard/subjects">
            <button className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
              View Subjects
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5 lg:p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-emerald-900">Overall Progress</h3>
              <span className="text-2xl font-bold text-emerald-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-emerald-700 mt-3 font-medium">
              {completedCount} of {lessons.length} lessons completed
            </p>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <Link
                key={i}
                href={`/dashboard/lessons/${lesson.subject_id}/${lesson.id}`}
              >
                <div
                  className={`flex items-center gap-4 p-4 lg:p-5 rounded-xl lg:rounded-2xl cursor-pointer transition-all border transform hover:scale-102 duration-200
                    ${
                      lesson.is_completed
                        ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-md"
                        : "bg-white border-gray-100 hover:border-emerald-300 hover:shadow-md"
                    }`}
                >
                  {/* Status Circle */}
                  <div className="flex-shrink-0">
                    {lesson.is_completed ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {lesson.order_number}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm lg:text-base truncate ${
                      lesson.is_completed ? "text-emerald-700" : "text-gray-900"
                    }`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 truncate">
                      {lesson.subjects?.title}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {lesson.is_completed && (
                    <div className="hidden sm:flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-semibold">Done</span>
                    </div>
                  )}

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back Button at Bottom */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
       

        <Link href="/dashboard/subjects" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
            View All Subjects
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}