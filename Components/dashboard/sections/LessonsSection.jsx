"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LessonsSection({ profile }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("lessons")
          .select("*, subjects(name)")
          .order("created_at", { ascending: false });

        setLessons(data || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading lessons...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lessons</h1>
      {lessons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No lessons available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {lesson.subjects?.name}
              </p>
              <button className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                Start Lesson
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
