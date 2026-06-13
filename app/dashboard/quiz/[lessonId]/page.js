"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Quiz() {
  const router = useRouter();
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      // Kunin yung lesson
      const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      setLesson(lesson);

      // I-check kung may quiz na
      const { data: existingQuiz } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (existingQuiz) {
        setQuiz(existingQuiz);
      } else {
        // Mag-generate ng quiz!
        setGenerating(true);
        await generateQuiz(lesson, user.id);
        setGenerating(false);
      }

      setLoading(false);
    };

    getData();
  }, [lessonId]);

  const generateQuiz = async (lesson, userId) => {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_title: lesson.title,
          lesson_content: lesson.content,
        }),
      });

      const { questions } = await response.json();

      const { data: savedQuiz } = await supabase
        .from("quizzes")
        .insert({
          lesson_id: lessonId,
          questions: questions,
          passing_score: 70,
          time_limit: 10,
        })
        .select()
        .single();

      setQuiz(savedQuiz);

    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleAnswer = (questionIndex, answer) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
  if (submitted) return;

  const questions = quiz.questions;
  let correct = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.correct_answer) {
      correct++;
    }
  });

  const scorePercent = Math.round((correct / questions.length) * 100);
  const isPassed = scorePercent >= 70;
  
  setScore(scorePercent);
  setSubmitted(true);

  try {
    // First — i-update yung progress with status
    const { data: existingProgress } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    const currentAttempts = (existingProgress?.attempts || 0) + 1;
    const currentBestScore = Math.max(existingProgress?.best_score || 0, scorePercent);

    const { error: progressError } = await supabase
      .from("progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: isPassed,
        score: scorePercent,
        status: isPassed ? "passed" : "failed",
        best_score: currentBestScore,
        attempts: currentAttempts,
        completed_at: isPassed ? new Date().toISOString() : null,
      });

    console.log("Progress error:", progressError);

    // Add XP ONLY kung passed (at first time lang)
    if (isPassed && !existingProgress?.best_score) {
      const { error: xpError } = await supabase
        .from("profiles")
        .update({ xp_points: profile.xp_points + 20 })
        .eq("id", user.id);

      console.log("XP error:", xpError);
    }

    // ← NEW: Check semester completion kung passed!
    if (isPassed) {
      console.log("Quiz passed! Checking semester completion...");
      
      const semesterResponse = await fetch("/api/check-semester-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          lessonId,
        }),
      });

      const semesterData = await semesterResponse.json();
      console.log("Semester check:", semesterData);

      if (semesterData.certificateAwarded) {
        console.log("🎉 CERTIFICATE AWARDED!");
        // Show certificate animation/message
        setShowCertificate(true);
      }
    }

    console.log("Score:", scorePercent, "Status:", isPassed ? "PASSED" : "FAILED");

  } catch (error) {
    console.error("Error submitting quiz:", error);
  }
};

  if (loading || generating) {
    return (
      <section className="w-full bg-transparent flex items-center justify-center py-10">
        <div className="text-center">
          <span className="text-4xl mb-3 block">🤖</span>
          <p className="text-sm text-gray-400">
            {generating ? "AI is generating your quiz..." : "Loading..."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-transparent">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="font-serif text-xl cursor-pointer">
            Lumina<span className="text-orange-500">PH</span>
          </div>
        </Link>
        <div className="text-sm font-medium text-gray-600">
          📝 Quiz — {lesson?.title}
        </div>
        <Link href="/dashboard">
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back
          </button>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Score Result */}
        {submitted && (
          <>
            <div className={`rounded-2xl p-6 mb-6 text-center ${
              score >= 70 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <p className="text-4xl mb-2">{score >= 70 ? "🎉" : "😅"}</p>
              <p className="text-2xl font-serif mb-1">{score}%</p>
              <p className={`text-sm font-medium ${score >= 70 ? "text-green-500" : "text-red-400"}`}>
                {score >= 70 ? "Passed! +20 XP" : "Failed — Try again!"}
              </p>
            </div>

            {/* ← NEW: Certificate Message */}
            {showCertificate && (
              <div className="rounded-2xl p-6 mb-6 text-center bg-blue-50 border border-blue-200">
                <p className="text-3xl mb-2">🏆</p>
                <p className="text-lg font-serif text-blue-700 mb-1">Semester Certificate Earned!</p>
                <p className="text-sm text-blue-600">
                  You've completed all subjects in this semester. Ready for the next level! 🚀
                </p>
              </div>
            )}
          </>
        )}

        {/* Questions */}
        <div className="flex flex-col gap-6">
          {quiz?.questions?.map((q, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-sm font-medium mb-4">
                {i + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.choices.map((choice, j) => {
                  const isSelected = answers[i] === choice;
                  const isCorrect = submitted && choice === q.correct_answer;
                  const isWrong = submitted && isSelected && choice !== q.correct_answer;

                  return (
                    <button
                      key={j}
                      onClick={() => handleAnswer(i, choice)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all border
                        ${isCorrect ? "bg-green-50 border-green-400 text-green-700" : ""}
                        ${isWrong ? "bg-red-50 border-red-400 text-red-700" : ""}
                        ${isSelected && !submitted ? "bg-orange-50 border-orange-400 text-orange-700" : ""}
                        ${!isSelected && !isCorrect ? "bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300" : ""}
                      `}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz?.questions?.length}
            className="w-full bg-orange-400 text-white text-sm py-3 rounded-xl mt-6 hover:bg-orange-500 disabled:opacity-50"
          >
            Submit Quiz →
          </button>
        )}

        {/* Back to lesson after submit */}
        {submitted && (
          <Link href={`/dashboard/lessons/${lesson?.subject_id}/${lessonId}`}>
            <button className="w-full border border-orange-400 text-orange-400 text-sm py-3 rounded-xl mt-6 hover:bg-orange-50">
              ← Back to Lesson
            </button>
          </Link>
        )}

      </div>
    </section>
  );
}