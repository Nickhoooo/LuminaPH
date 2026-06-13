"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import Link from "next/link";
import { Lock, BookOpen, CheckCircle, Zap } from "lucide-react";

export default function SubjectsPage() {
  const router = useRouter();
  const { profile } = useDashboard();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedSemesters, setCompletedSemesters] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: certificates } = await supabase
        .from("certificates")
        .select("semester")
        .eq("user_id", user.id);

      const completedSems = certificates?.map((c) => c.semester) || [];
      setCompletedSemesters(completedSems);

      const { data: existingSubjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id)
        .order("semester");

      const { data: progressData } = await supabase
        .from("progress")
        .select("*, lessons(subject_id)")
        .eq("user_id", user.id)
        .eq("is_completed", true);

      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id, subject_id");

      const subjectsWithProgress = existingSubjects?.map((subject) => {
        const subjectLessons = allLessons?.filter(
          (l) => l.subject_id === subject.id
        );
        const completedLessons = progressData?.filter(
          (p) => p.lessons?.subject_id === subject.id
        );

        const total = subjectLessons?.length || 0;
        const completed = completedLessons?.length || 0;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const semester = subject.semester || 1;
        const isLocked = semester > 1 && !completedSems.includes(semester - 1);

        return {
          ...subject,
          progress,
          total,
          completed,
          semester,
          isLocked,
        };
      });

      setSubjects(subjectsWithProgress || []);
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  const groupedBySemester = {};
  subjects.forEach((subject) => {
    const sem = subject.semester || 1;
    if (!groupedBySemester[sem]) {
      groupedBySemester[sem] = [];
    }
    groupedBySemester[sem].push(subject);
  });

  const semesters = Object.keys(groupedBySemester).sort((a, b) => a - b);

  const getDifficultyColor = (level) => {
    switch (level) {
      case "basic":
        return "bg-emerald-100 text-emerald-700";
      case "intermediate":
        return "bg-amber-100 text-amber-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyEmoji = (level) => {
    switch (level) {
      case "basic":
        return "🌱";
      case "intermediate":
        return "🌿";
      case "advanced":
        return "🔥";
      default:
        return "📚";
    }
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-10 lg:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl lg:text-4xl font-bold">My Subjects</h1>
        </div>
        <p className="text-sm lg:text-base text-gray-600">
          Your personalized learning path, unlocked one semester at a time 
        </p>
      </div>

      {/* Semesters */}
      {semesters.map((semNum) => {
        const semSubjects = groupedBySemester[semNum];
        const semCompleted = completedSemesters.includes(parseInt(semNum));
        const isCurrentSemLocked =
          parseInt(semNum) > 1 &&
          !completedSemesters.includes(parseInt(semNum) - 1);

        const semesterLabel =
          semNum === 1 ? "1st" : semNum === 2 ? "2nd" : semNum === 3 ? "3rd" : semNum + "th";

        return (
          <div key={semNum} className="mb-12 lg:mb-16">
            {/* Semester Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 lg:mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {semNum}
                </div>
                <h2 className="text-xl lg:text-2xl font-bold">{semesterLabel} Semester</h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {semCompleted && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}

                {isCurrentSemLocked && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                    <Lock className="w-4 h-4" />
                    Locked
                  </span>
                )}
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {semSubjects.map((subject, i) => {
                const isLocked = subject.isLocked;
                const diffColor = getDifficultyColor(subject.difficulty_level);
                const diffEmoji = getDifficultyEmoji(subject.difficulty_level);

                return isLocked ? (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-5 lg:p-6 opacity-60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${diffColor}`}>
                          {diffEmoji} {subject.difficulty_level}
                        </span>
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>

                      <h3 className="text-base lg:text-lg font-bold text-gray-700 mb-2">
                        {subject.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-500 mb-4 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center font-medium">
                        🔓 Complete {semesterLabel === "1st" ? "intro" : `${parseInt(semNum) - 1}${["st", "nd", "rd"][parseInt(semNum) - 2] || "th"} semester`} to unlock
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link key={i} href={`/dashboard/lessons/${subject.id}`}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between transform hover:-translate-y-1">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${diffColor}`}>
                            {diffEmoji} {subject.difficulty_level}
                          </span>
                          <span className="text-emerald-500 group-hover:scale-110 transition-transform">
                            →
                          </span>
                        </div>

                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {subject.title}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 mb-4 leading-relaxed">
                          {subject.description}
                        </p>
                      </div>

                      {/* Progress Section */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-600 font-medium">
                            {subject.completed}/{subject.total} lessons
                          </span>
                          <span className="text-sm font-bold text-emerald-600">
                            {subject.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(subject.progress, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}