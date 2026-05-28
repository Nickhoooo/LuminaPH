"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) throw loginError;

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

        <h2 className="text-2xl font-serif mb-1">Welcome back!</h2>
        <p className="text-sm text-gray-400 mb-6 font-light">Log in to continue learning</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-emerald-600 text-white text-sm py-3 rounded-xl mt-6 hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in →"}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Wala ka pang account?{" "}
          <Link href="/signup" className="text-emerald-600">Sign up</Link>
        </p>

      </div>
    </main>
  );
}