export default function Banner({ profile }) {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white mb-6">
      <p className="text-xs font-medium opacity-75 mb-2 uppercase tracking-widest">
        Personalized for you
      </p>
      <h2 className="text-2xl font-bold mb-2">
        Your AI Teacher is ready!
      </h2>
      <p className="text-sm opacity-75 mb-6">
        We've prepared subjects based on your{" "}
        <span className="font-medium">{profile?.course}</span>{" "}
        {profile?.year_level} profile
      </p>
      <button className="bg-white text-emerald-600 text-sm px-6 py-2 rounded-xl font-medium hover:bg-emerald-50 cursor-pointer transition-all">
        Start Learning →
      </button>
    </div>
  );
}