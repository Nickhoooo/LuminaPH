import Image from "next/image";
import PointsIcon from "@/public/PointsIcon.png";
import LessonsIcon from "@/public/LessonsIcon.png";
import StreakIcon from "@/public/StreakIcon.png";
import SubjectsIcon from "@/public/SubjectsIcon.png";

const stats = [
  { icon: PointsIcon, label: "Points", key: "xp_points" },
  { icon: LessonsIcon, label: "Lessons", key: "lessons" },
  { icon: StreakIcon, label: "Streak", key: "streak" },
  { icon: SubjectsIcon, label: "Subjects", key: "subjects" },
];

export default function StatsCards({ profile, lessonsCount, subjectsCount }) {
  const data = {
    xp_points: profile?.xp_points || 0,
    lessons: lessonsCount || 0,
    streak: profile?.streak || 0,
    subjects: subjectsCount || 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white border border-gray-100 rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
        >
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <Image src={stat.icon} alt={stat.label} className="w-6 lg:w-8" />
            <button className="text-gray-600 hover:text-gray-400 text-sm">⋯</button>
          </div>
          <div className="text-xl lg:text-2xl font-medium">
            {data[stat.key]}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}