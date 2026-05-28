export default function RightPanel({ profile }) {
  const goals = [
    { icon: "📖", label: "Complete 2", desc: "Data Structure", done: false },
    { icon: "📚", label: "Lessons today", desc: "Algorithm", done: false },
    { icon: "🎥", label: "Watch Video", desc: "React", done: false },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <aside className="w-80  bg-white border-l border-gray-100  px-4 py-6 flex flex-col gap-6 ">

      {/* Profile Card */}
      <div className="flex flex-col items-center text-center">
        <p className="text-xs text-gray-400 self-start mb-3">Profile</p>

        {/* Avatar */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-medium text-orange-500 mb-3">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Greeting */}
        <p className="text-xs text-orange-400 font-medium uppercase tracking-widest">
          {getGreeting()} ☀️
        </p>

        {/* Name */}
        <p className="text-sm font-medium mt-1">{profile?.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Continue your learning to achieve your target!
        </p>

        {/* Badge */}
        <div className="mt-2 bg-orange-50 text-orange-400 text-xs px-3 py-1 rounded-full font-medium">
          {profile?.course} {profile?.year_level}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Daily Goal */}
      <div>
        <p className="text-xs text-gray-400 mb-3">Daily Goal</p>
        <div className="flex flex-col gap-2">
          {goals.map((goal, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{goal.icon}</span>
                <div>
                  <p className="text-xs font-medium">{goal.label}</p>
                  <p className="text-xs text-gray-400">{goal.desc}</p>
                </div>
              </div>
              <button className="text-xs bg-orange-400 text-white px-3 py-1 rounded-lg hover:bg-orange-500">
                View
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 bg-orange-400 text-white text-xs py-2 rounded-xl hover:bg-orange-500">
          See All
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* AI Teacher */}
      <div>
        <p className="text-xs text-gray-400 mb-3">Start Chat</p>
        <button className="w-full flex items-center justify-center gap-2 bg-orange-400 text-white text-sm py-3 rounded-xl hover:bg-orange-500">
          <span>🤖</span>
          <span>AI Teacher</span>
        </button>
      </div>

    </aside>
  );
}