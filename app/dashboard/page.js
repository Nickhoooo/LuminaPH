"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/Components/dashboard/Sidebar";
import Navbar from "@/Components/dashboard/Navbar";
import Banner from "@/Components/dashboard/Banner";
import StatsCards from "@/Components/dashboard/StatsCards";
import ContinueLearning from "@/Components/dashboard/ContinueLearning";
import RecentActivity from "@/Components/dashboard/RecentActivity";
import RightPanel from "@/Components/dashboard/RightPanel";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingSubjects, setGeneratingSubjects] = useState(false);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    let subscription = null;

    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profile);

      const { data: existingSubjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);

      if (existingSubjects && existingSubjects.length > 0) {
  
      // Kunin yung progress ng lahat ng lessons
      const { data: progressData } = await supabase
        .from("progress")
        .select("*, lessons(subject_id)")
        .eq("user_id", user.id)
        .eq("is_completed", true);

      // Kunin yung lesson counts per subject
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id, subject_id");

      // I-compute yung progress per subject
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

      // Setup real-time AFTER all fetches
      subscription = supabase
        .channel(`profile-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            setProfile(payload.new);
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });
    };

    getProfile();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

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

    } catch (error) {
      console.error("Error generating subjects:", error);
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
    <main className="min-h-screen bg-[#FFF5EB] flex">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Center + Right */}
      <div className="flex flex-1">

        {/* Main Content */}
        <div className="flex-1 px-8 py-6">
          <Navbar profile={profile} />
          <Banner profile={profile} />
          <StatsCards 
              profile={profile} 
              lessonsCount={lessonsCount} 
              subjectsCount={subjectsCount}
          />
          <ContinueLearning
            subjects={subjects}
            generating={generatingSubjects}
          />
          <RecentActivity activities={null} />
        </div>

        {/* Right Panel */}
        <RightPanel profile={profile} />

      </div>

    </main>
  );
}