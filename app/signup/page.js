"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    education_level: "",
    year_level: "",
    course: "",
    learning_style: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1 — Gumawa ng account sa Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      // Step 2 — I-save yung profile sa profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          name: formData.name,
          age: parseInt(formData.age),
          education_level: formData.education_level,
          year_level: formData.year_level,
          course: formData.course,
          learning_style: formData.learning_style,
        });

      if (profileError) throw profileError;

      // Step 3 — Redirect to dashboard
      router.push("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-10 w-full max-w-md">

        {/* Logo */}
        <Link href="/">
          <div className="font-serif text-xl mb-8 cursor-pointer">
            Lumina<span className="text-amber-600">PH</span>
          </div>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${step === s ? "bg-emerald-600 text-white" : ""}
                ${step > s ? "bg-emerald-100 text-emerald-600" : ""}
                ${step < s ? "bg-gray-100 text-gray-400" : ""}
              `}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`h-px w-12 ${step > s ? "bg-emerald-300" : "bg-gray-200"}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-2">Step {step} of 3</span>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-serif mb-1">Create your account</h2>
            <p className="text-sm text-gray-400 mb-6 font-light">Let's start with the basics</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Juan dela Cruz"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>
            <button onClick={nextStep}
              className="w-full bg-emerald-600 text-white text-sm py-3 rounded-xl mt-6 hover:bg-emerald-700">
              Continue →
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600">Log in</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Academic Info */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-serif mb-1">Your academic profile</h2>
            <p className="text-sm text-gray-400 mb-6 font-light">This helps us personalize your lessons</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Age</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="18"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Education level</label>
                <select name="education_level" value={formData.education_level} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 bg-white">
                  <option value="">Select level</option>
                  <option value="high_school">High School</option>
                  <option value="college">College</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Year / Grade level</label>
                <input name="year_level" value={formData.year_level} onChange={handleChange} placeholder="e.g. 2nd Year / Grade 11"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Course / Strand</label>
                <input name="course" value={formData.course} onChange={handleChange} placeholder="e.g. BSCS, STEM, BSBA"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={prevStep}
                className="w-1/3 border border-gray-200 text-gray-500 text-sm py-3 rounded-xl hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={nextStep}
                className="w-2/3 bg-emerald-600 text-white text-sm py-3 rounded-xl hover:bg-emerald-700">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Learning Style */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-serif mb-1">How do you learn best?</h2>
            <p className="text-sm text-gray-400 mb-6 font-light">Your AI teacher will adapt to your style</p>
            <div className="flex flex-col gap-3">
              {[
                { value: "visual", label: "👁️ Visual", desc: "I learn better with diagrams and illustrations" },
                { value: "reading", label: "📖 Reading", desc: "I prefer reading detailed explanations" },
                { value: "practice", label: "✏️ Practice", desc: "I learn by doing exercises and quizzes" },
              ].map((style) => (
                <div key={style.value} onClick={() => setFormData({ ...formData, learning_style: style.value })}
                  className={`border rounded-xl px-4 py-3 cursor-pointer transition-all
                    ${formData.learning_style === style.value ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="text-sm font-medium">{style.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{style.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={prevStep}
                className="w-1/3 border border-gray-200 text-gray-500 text-sm py-3 rounded-xl hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="w-2/3 bg-emerald-600 text-white text-sm py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                {loading ? "Creating account..." : "Create account 🎉"}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}