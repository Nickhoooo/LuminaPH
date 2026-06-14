"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Lightbulb, Loader } from "lucide-react";

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

      const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      setLesson(lesson);

      const { data: existingQuiz } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (existingQuiz) {
        setQuiz(existingQuiz);
      } else {
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
      const { data: existingProgress } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      const currentAttempts = (existingProgress?.attempts || 0) + 1;
      const currentBestScore = Math.max(existingProgress?.best_score || 0, scorePercent);

      await supabase.from("progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: isPassed,
        score: scorePercent,
        status: isPassed ? "passed" : "failed",
        best_score: currentBestScore,
        attempts: currentAttempts,
        completed_at: isPassed ? new Date().toISOString() : null,
      });

      if (isPassed && !existingProgress?.best_score) {
        await supabase
          .from("profiles")
          .update({ xp_points: profile.xp_points + 20 })
          .eq("id", user.id);
      }

      if (isPassed) {
        const semesterResponse = await fetch("/api/check-semester-completion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            lessonId,
          }),
        });

        const semesterData = await semesterResponse.json();

        if (semesterData.certificateAwarded) {
          setShowCertificate(true);
        }
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading || generating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            {generating ? "AI is generating your quiz..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 lg:py-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="text-center flex-1">
            <p className="text-xs lg:text-sm text-gray-600 font-medium">
              📝 {lesson?.title}
            </p>
          </div>

          <div className="text-xs lg:text-sm text-gray-600 font-medium">
            {answeredCount}/{totalQuestions}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-10">

        {/* Score Result */}
        {submitted && (
          <>
            <div className={`rounded-2xl p-6 lg:p-8 mb-8 text-center ${
              score >= 70 
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200" 
                : "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200"
            }`}>
              <div className="text-5xl lg:text-6xl mb-4">
                {score >= 70 ? "🎉" : "😅"}
              </div>
              <p className="text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
                {score}%
              </p>
              <p className={`text-base lg:text-lg font-semibold ${
                score >= 70 ? "text-emerald-600" : "text-red-600"
              }`}>
                {score >= 70 ? "Passed! +20 XP" : "Failed — Try again!"}
              </p>
            </div>

            {showCertificate && (
              <div className="rounded-2xl p-6 lg:p-8 mb-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 animate-bounce">
                <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
                  Semester Certificate Earned! 🏆
                </p>
                <p className="text-sm lg:text-base text-blue-700">
                  You've completed all subjects in this semester. Ready for the next level! 🚀
                </p>
              </div>
            )}
          </>
        )}

        {/* Questions */}
        <div className="space-y-4 lg:space-y-6">
          {quiz?.questions?.map((q, i) => (
            <div 
              key={i} 
              className="bg-white border border-gray-100 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Question Number & Progress */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs lg:text-sm font-bold text-emerald-600 uppercase tracking-widest">
                  Question {i + 1} of {quiz.questions.length}
                </p>
                {submitted && answers[i] === q.correct_answer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {submitted && answers[i] && answers[i] !== q.correct_answer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>

              {/* Question Text */}
              <p className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                {q.question}
              </p>

              {/* Choices */}
              <div className="space-y-2">
                {q.choices.map((choice, j) => {
                  const isSelected = answers[i] === choice;
                  const isCorrect = submitted && choice === q.correct_answer;
                  const isWrong = submitted && isSelected && choice !== q.correct_answer;

                  return (
                    <button
                      key={j}
                      onClick={() => handleAnswer(i, choice)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 lg:py-4 rounded-lg lg:rounded-xl text-sm lg:text-base transition-all border-2 font-medium
                        ${isCorrect 
                          ? "bg-emerald-50 border-emerald-400 text-emerald-700" 
                          : isWrong 
                          ? "bg-red-50 border-red-400 text-red-700" 
                          : isSelected && !submitted 
                          ? "bg-emerald-100 border-emerald-500 text-emerald-700" 
                          : "bg-white border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50"
                        }
                        ${submitted ? "cursor-default" : "cursor-pointer"}
                      `}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="mt-4 flex items-start gap-3 bg-blue-50 rounded-lg p-3 lg:p-4 border border-blue-200">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs lg:text-sm text-blue-700">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 lg:mt-10 space-y-3">
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={answeredCount !== totalQuestions}
              className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg transition-all transform
                ${answeredCount === totalQuestions
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {answeredCount === totalQuestions 
                ? "Submit Quiz →" 
                : `Answer all questions (${answeredCount}/${totalQuestions})`
              }
            </button>
          )}

          {submitted && (
            <>
              <Link href={`/dashboard/lessons/${lesson?.subject_id}/${lessonId}`} className="block">
                <button className="w-full py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors">
                  Back to Lesson
                </button>
              </Link>
              
              <Link href={`/dashboard/lessons/${lesson?.subject_id}`} className="block">
                <button className="w-full py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                  View All Lessons
                </button>
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
}