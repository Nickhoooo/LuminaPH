"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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

      // Get all certificates
      const { data: certs } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_date", { ascending: false });

      setCertificates(certs || []);
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F0FDF4] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0FDF4]">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="font-serif text-xl cursor-pointer">
            Lumina<span className="text-emerald-500">PH</span>
          </div>
        </Link>
        <div className="text-sm font-medium text-gray-600">
          🏆 My Certificates
        </div>
        <Link href="/dashboard">
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back
          </button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-serif mb-2">Your Achievements</h1>
          <p className="text-sm text-gray-400">
            {certificates.length} semester{certificates.length !== 1 ? "s" : ""} completed! 🎓
          </p>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-3">🎯</span>
            <p className="text-sm text-gray-400 font-light mb-6">
              No certificates yet! Complete all subjects in a semester to earn one.
            </p>
            <Link href="/dashboard">
              <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600">
                Continue Learning →
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 transform hover:scale-105 transition-transform">
                
                {/* Certificate Header */}
                <div className="text-center mb-6">
                  <span className="text-5xl block mb-3">🏆</span>
                  <h2 className="text-xl font-serif text-emerald-700">Certificate of Completion</h2>
                </div>

                {/* Certificate Content */}
                <div className="text-center border-t border-b border-emerald-200 py-6 mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Presented to</p>
                  <p className="text-lg font-serif text-gray-800 mb-4">{profile?.name}</p>
                  
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">For completing</p>
                  <p className="text-sm font-medium text-emerald-700 mb-1">{cert.course}</p>
                  <p className="text-sm text-gray-600">{cert.semester === 1 ? "1st" : "2nd"} Semester</p>
                </div>

                {/* Date */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Earned on</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(cert.earned_date).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadCertificate(cert, profile?.name)}
                  className="w-full mt-6 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 text-sm font-medium"
                >
                  📥 Download Certificate
                </button>

              </div>
            ))}
          </div>
        )}

        {/* Next Steps */}
        {certificates.length > 0 && (
          <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">What's Next?</h3>
            <div className="flex flex-col gap-3">
              {certificates.length === 1 && (
                <Link href="/dashboard">
                  <button className="text-left text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    → Continue to 2nd Semester
                  </button>
                </Link>
              )}
              {certificates.length === 2 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    🎉 You've completed all semesters! Ready for specialization?
                  </p>
                  <p className="text-xs text-gray-400">
                    Specialization tracks coming soon! 🚀
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// Helper function para mag-download ng certificate
function downloadCertificate(cert, studentName) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#F0FDF4";
  ctx.fillRect(0, 0, 1000, 700);

  // Border
  ctx.strokeStyle = "#10B981";
  ctx.lineWidth = 5;
  ctx.strokeRect(30, 30, 940, 640);

  // Title
  ctx.fillStyle = "#059669";
  ctx.font = "bold 40px serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", 500, 100);

  // Presented to
  ctx.fillStyle = "#666";
  ctx.font = "16px sans-serif";
  ctx.fillText("This is to certify that", 500, 200);

  ctx.fillStyle = "#000";
  ctx.font = "bold 32px serif";
  ctx.fillText(studentName, 500, 260);

  ctx.fillStyle = "#666";
  ctx.font = "16px sans-serif";
  ctx.fillText(`has successfully completed`, 500, 320);

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(cert.course, 500, 370);

  ctx.fillStyle = "#666";
  ctx.fillText(`${cert.semester === 1 ? "1st" : "2nd"} Semester`, 500, 410);

  // Date
  ctx.fillStyle = "#999";
  ctx.font = "14px sans-serif";
  ctx.fillText(
    `Earned: ${new Date(cert.earned_date).toLocaleDateString("en-PH")}`,
    500,
    550
  );

  // Download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `LuminaPH_Certificate_${cert.semester}sem_${studentName}.png`;
  link.click();
}