"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Use maybeSingle() instead of single() — returns null if no row found
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        let profile = existingProfile;

        // If NO profile exists — create one!
        if (!profile) {
          console.log("No profile found — creating one...");
          
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              name: user.email?.split("@")[0] || "Student",
              xp_points: 0,
              streak: 0,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            console.error("Failed to create profile:", createError);
            setLoading(false);
            return;
          }

          profile = newProfile;
          console.log("Profile created successfully:", profile);
        }

        setProfile(profile);

        // Get subjects
        const { data: existingSubjects, error: subjectsError } = await supabase
          .from("subjects")
          .select("*")
          .eq("user_id", user.id);

        if (subjectsError) {
          console.error("Subjects fetch error:", subjectsError);
        }

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
        }

        const { data: completedLessons } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_completed", true);

        setLessonsCount(completedLessons?.length || 0);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard context error:", error);
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        profile,
        subjects,
        loading,
        lessonsCount,
        subjectsCount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}