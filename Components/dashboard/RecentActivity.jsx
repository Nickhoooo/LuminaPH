export default function RecentActivity({ activities }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Recent Activities</h2>
        <button className="text-xs text-orange-400 hover:text-orange-500">See All →</button>
      </div>

      {/* Empty State */}
      {!activities || activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-gray-400 font-light">
            No activities yet — start learning to see your progress!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              
              {/* Icon */}
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">
                {activity.type === "lesson" ? "📖" : "📝"}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.subject}</p>
              </div>

              {/* Score or Status */}
              <div className={`text-xs font-medium px-3 py-1 rounded-full
                ${activity.type === "quiz"
                  ? activity.score >= 70
                    ? "bg-green-50 text-green-500"
                    : "bg-red-50 text-red-400"
                  : "bg-orange-50 text-orange-400"
                }`}>
                {activity.type === "quiz" ? `${activity.score}%` : "Completed"}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}