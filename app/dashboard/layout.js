"use client";
import Sidebar from "@/Components/dashboard/Sidebar";
import Navbar from "@/Components/dashboard/Navbar";
import RightPanel from "@/Components/dashboard/RightPanel";
import AITeacherWidget from "@/Components/dashboard/AITeacherWidget";
import { DashboardProvider, useDashboard } from "@/lib/DashboardContext";

function DashboardLayoutContent({ children }) {
  const { profile, subjects, loading } = useDashboard();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar with Mobile Menu */}
        <Navbar profile={profile} />

        {/* Content + RightPanel */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-[50px]">
                {children}
              </div>
            </main>
          </div>

          {/* Right Panel - Hidden on mobile */}
          <div className="hidden xl:block">
            {!loading && <RightPanel profile={profile} subjects={subjects} />}
          </div>
        </div>
      </div>

      {/* AI Teacher Widget */}
      <AITeacherWidget />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}