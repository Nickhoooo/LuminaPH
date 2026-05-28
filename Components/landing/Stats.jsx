const stats = [
  { num: "24/7", label: "AI teacher availability" },
  { num: "100%", label: "Personalized to you" },
  { num: "PH", label: "Made for Filipinos" },
  { num: "Free", label: "To get started" },
];

export default function Stats() {
  return (
    <div className="flex border-t border-b border-gray-100 mx-10">
      {stats.map((stat, i) => (
        <div key={i} className="flex-1 text-center py-10 border-r border-gray-900-100 last:border-r-2">
          <div className="text-2xl font-Poppins text-gray-400-50">{stat.num}</div>
          <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}