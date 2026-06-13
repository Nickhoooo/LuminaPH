"use client";
import { Settings, Bell, Lock, Palette, HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const settingsSections = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage your notification preferences",
      color: "blue",
    },
    {
      icon: Palette,
      label: "Theme & Appearance",
      description: "Coming soon - Dark mode and more",
      color: "purple",
    },
    {
      icon: Lock,
      label: "Privacy & Security",
      description: "Control your privacy settings",
      color: "red",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with Lumina PH",
      color: "amber",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-50 to-blue-100 border-blue-200",
      purple: "from-purple-50 to-purple-100 border-purple-200",
      red: "from-red-50 to-red-100 border-red-200",
      amber: "from-amber-50 to-amber-100 border-amber-200",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      red: "text-red-600",
      amber: "text-amber-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl lg:text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-sm lg:text-base text-gray-600">
          Customize your Lumina PH experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {settingsSections.map((section, i) => {
          const Icon = section.icon;
          const colorClasses = getColorClasses(section.color);
          const iconColor = getIconColor(section.color);

          return (
            <div
              key={i}
              className={`bg-gradient-to-br ${colorClasses} border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {section.label}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-8" />

      {/* Account Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8">
        <h2 className="text-lg font-bold mb-4">Account</h2>

        <div className="space-y-3">
          {/* Account Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">Account Status</p>
              <p className="text-xs text-gray-600 mt-0.5">Active and in good standing</p>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors border border-red-200"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-blue-700 font-medium mb-2">
          ✨ More settings coming soon!
        </p>
        <p className="text-xs text-blue-600">
          We're working on new features to customize your learning experience
        </p>
      </div>
    </div>
  );
}