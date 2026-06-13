const stats = [
  { num: "24/7", label: "AI teacher" },
  { num: "100%", label: "Personalized" },
  { num: "PH", label: "Made for Filipinos" },
  { num: "Free", label: "To start" },
];

export default function Stats() {
  return (
    <div className="border-t border-b border-gray-100 mx-4 lg:mx-10">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center justify-center py-6 lg:py-10 px-2 lg:px-4 border-r border-gray-100 last:border-r-0"
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.num}</div>
            <div className="text-xs lg:text-sm text-gray-500 mt-1 text-center leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}