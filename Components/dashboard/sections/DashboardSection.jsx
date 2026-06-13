"use client";

import Banner from "../Banner";
import StatsCards from "../StatsCards";
import ContinueLearning from "../ContinueLearning";
import RecentActivity from "../RecentActivity";

export default function DashboardSection({
  profile,
  subjects,
  lessonsCount,
  subjectsCount,
  generating,
}) {
  return (
    <div className="space-y-6">
      <Banner profile={profile} />
      <StatsCards
        profile={profile}
        lessonsCount={lessonsCount}
        subjectsCount={subjectsCount}
      />
      <ContinueLearning subjects={subjects} generating={generating} />
      <RecentActivity activities={null} />
    </div>
  );
}
