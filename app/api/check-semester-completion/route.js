import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  try {
    const { userId, semester } = await request.json();

    // Get all subjects for this semester
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id")
      .eq("user_id", userId)
      .eq("semester", semester);

    if (!subjects || subjects.length === 0) {
      return Response.json({
        success: false,
        message: "No subjects found for this semester"
      });
    }

    const subjectIds = subjects.map(s => s.id);

    // Get ALL lessons for these subjects
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, subject_id")
      .in("subject_id", subjectIds);

    const lessonIds = lessons?.map(l => l.id) || [];

    // Get progress for ALL lessons
    const { data: progress } = await supabase
      .from("progress")
      .select("*")
      .in("lesson_id", lessonIds)
      .eq("user_id", userId);

    // Check if EACH subject has at least one PASSED lesson
    const allSubjectsPassed = subjects.every(subject => {
      return progress?.some(p => {
        const lessonBelongsToSubject = lessons?.some(
          l => l.id === p.lesson_id && l.subject_id === subject.id
        );
        return p.status === "passed" && lessonBelongsToSubject;
      });
    });

    if (allSubjectsPassed) {
      // Award certificate!
      const { data: course } = await supabase
        .from("profiles")
        .select("course")
        .eq("id", userId)
        .single();

      const { error } = await supabase
        .from("certificates")
        .insert({
          user_id: userId,
          semester: semester,
          course: course?.course || "Course"
        });

      if (error) {
        console.error("Certificate error:", error);
        return Response.json({ success: false, error: error.message });
      }

      return Response.json({
        success: true,
        message: "🎉 Certificate awarded!",
        certificateAwarded: true
      });
    }

    // Count how many subjects passed
    const passedCount = subjects.filter(subject => 
      progress?.some(p => {
        const lessonBelongsToSubject = lessons?.some(
          l => l.id === p.lesson_id && l.subject_id === subject.id
        );
        return p.status === "passed" && lessonBelongsToSubject;
      })
    ).length;

    return Response.json({
      success: true,
      message: "Not all subjects passed yet",
      certificateAwarded: false,
      passedCount: passedCount,
      totalSubjects: subjects.length
    });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}