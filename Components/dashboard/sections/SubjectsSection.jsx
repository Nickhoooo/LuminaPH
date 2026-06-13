"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubjectsSection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("subjects")
          .select("*, lessons(id)")
          .eq("user_id", user.id);

        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading subjects...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>
      {subjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No subjects yet. Start by generating subjects based on your profile!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {subject.lessons?.length || 0} lessons
              </p>
              <button className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                View Subject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
