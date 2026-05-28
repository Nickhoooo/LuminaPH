export default function Banner({ profile }) {
  return (
    <div className="bg-orange-400 rounded-2xl p-8 text-white mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
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
      <button className="bg-white text-orange-400 text-sm px-6 py-2 rounded-xl font-medium hover:bg-orange-50">
        Start Learning →
      </button>
    </div>
  );
}