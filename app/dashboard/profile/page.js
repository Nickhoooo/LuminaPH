"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import { User, Edit2, Save, X, Zap, Flame, BookOpen, BarChart3, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { profile } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    age: "",
    course: "",
    year_level: "",
    education_level: "",
    learning_style: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile?.name || "",
        bio: profile?.bio || "",
        age: profile?.age || "",
        course: profile?.course || "",
        year_level: profile?.year_level || "",
        education_level: profile?.education_level || "",
        learning_style: profile?.learning_style || "",
      });
      setLoading(false);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from("profiles")
        .update({
          name: formData.name,
          bio: formData.bio,
          age: parseInt(formData.age) || null,
          course: formData.course,
          year_level: formData.year_level,
          education_level: formData.education_level,
          learning_style: formData.learning_style,
        })
        .eq("id", user.id);

      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl lg:text-4xl font-bold">My Profile</h1>
        </div>
        <p className="text-sm lg:text-base text-gray-600">
          Your personalized learning profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 lg:p-10 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {profile?.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {profile?.course} • {profile?.year_level}
            </p>
            <p className="text-sm text-gray-700 mb-5 max-w-md">
              {profile?.bio || "No bio yet — add one to tell others about yourself!"}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs text-gray-600">XP Points</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {profile?.xp_points}
                </p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-gray-600">Streak</p>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {profile?.streak}
                </p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-gray-600">Learning</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 capitalize">
                  {profile?.learning_style?.split("_")[0] || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="sm:self-start flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
            >
              <Edit2 className="w-5 h-5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-500" />
            <h2 className="text-lg font-bold">Profile Details</h2>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formData.name || "—"}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Age
            </label>
            {editing ? (
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formData.age || "—"}
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Course / Strand
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                placeholder="e.g., STEM, ABM, HUMSS"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formData.course || "—"}
              </p>
            )}
          </div>

          {/* Year Level */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Year / Grade Level
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.year_level}
                onChange={(e) =>
                  setFormData({ ...formData, year_level: e.target.value })
                }
                placeholder="e.g., 1st Year, Grade 12"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formData.year_level || "—"}
              </p>
            )}
          </div>

          {/* Education Level */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Education Level
            </label>
            {editing ? (
              <select
                value={formData.education_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education_level: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
              >
                <option value="">Select Level</option>
                <option value="high_school">High School</option>
                <option value="college">College</option>
                <option value="others">Others</option>
              </select>
            ) : (
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {formData.education_level?.replace("_", " ") || "—"}
              </p>
            )}
          </div>

          {/* Learning Style */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Learning Style
            </label>
            {editing ? (
              <select
                value={formData.learning_style}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    learning_style: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
              >
                <option value="">Select Style</option>
                <option value="visual">Visual</option>
                <option value="reading">Reading & Writing</option>
                <option value="practice">Practice & Hands-on</option>
              </select>
            ) : (
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {formData.learning_style?.replace("_", " ") || "—"}
              </p>
            )}
          </div>

          {/* Bio - Full Width */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">
              Bio
            </label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
              />
            ) : (
              <p className="text-base text-gray-700 leading-relaxed">
                {formData.bio || "No bio yet — add one to tell others about yourself!"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}