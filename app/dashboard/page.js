"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import DashboardSection from "@/Components/dashboard/sections/DashboardSection";

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useDashboard();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingSubjects, setGeneratingSubjects] = useState(false);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Profile is already in context — don't fetch again!
      if (!profile) {
        setLoading(false);
        return;
      }

      const { data: existingSubjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);

      if (existingSubjects && existingSubjects.length > 0) {
        const { data: progressData } = await supabase
          .from("progress")
          .select("*, lessons(subject_id)")
          .eq("user_id", user.id)
          .eq("is_completed", true);

        const { data: allLessons } = await supabase
          .from("lessons")
          .select("id, subject_id");

        const subjectsWithProgress = existingSubjects.map((subject) => {
          const subjectLessons = allLessons?.filter(
            (l) => l.subject_id === subject.id
          );
          const completedLessons = progressData?.filter(
            (p) => p.lessons?.subject_id === subject.id
          );

          const total = subjectLessons?.length || 0;
          const completed = completedLessons?.length || 0;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return { ...subject, progress };
        });

        setSubjects(subjectsWithProgress);
        setSubjectsCount(existingSubjects.length);
      } else {
        setGeneratingSubjects(true);
        await generateSubjects(profile, user.id);
        setGeneratingSubjects(false);
      }

      const { data: completedLessons } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", true);

      setLessonsCount(completedLessons?.length || 0);
      setLoading(false);
    };

    getData();
  }, [profile]);

  const generateSubjects = async (profile, userId) => {
    try {
      const response = await fetch("/api/generate-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          course: profile.course,
          year_level: profile.year_level,
          education_level: profile.education_level,
          learning_style: profile.learning_style,
          age: profile.age,
        }),
      });

      const { subjects } = await response.json();

      const subjectsToInsert = subjects.map((subject) => ({
        ...subject,
        user_id: userId,
      }));

      const { data: savedSubjects } = await supabase
        .from("subjects")
        .insert(subjectsToInsert)
        .select();

      setSubjects(savedSubjects);
      setSubjectsCount(savedSubjects.length);
    } catch (error) {
      console.error("Error generating subjects:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardSection
      profile={profile}
      subjects={subjects}
      lessonsCount={lessonsCount}
      subjectsCount={subjectsCount}
      generating={generatingSubjects}
    />
  );
}