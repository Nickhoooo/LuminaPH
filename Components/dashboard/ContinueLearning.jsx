import Link from "next/link";

export default function ContinueLearning({ subjects, generating }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Continue Learning</h2>
        <button className="text-xs text-emerald-400 hover:text-emerald-500">See All →</button>
      </div>

      {/* Generating State */}
      {generating ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-3xl mb-3">🤖</span>
          <p className="text-sm text-gray-400 font-light">
            Your AI teacher is generating your subjects...
          </p>
        </div>

      /* Empty State */
      ) : !subjects || subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-3xl mb-3">📚</span>
          <p className="text-sm text-gray-400 font-light">
            No subjects yet!
          </p>
        </div>

      /* Subjects List */
      ) : (
        <div className="flex flex-col gap-3">
          {subjects.map((subject, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{subject.title}</p>
                <p className="text-xs text-gray-400 mb-2">{subject.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all" 
                    style={{ width: `${Math.min(subject.progress || 0, 100)}%` }} 
                  />
                </div>
              </div>
              <Link href={`/dashboard/lessons/${subject.id}`}>
                <button className="ml-4 text-xs bg-emerald-500 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-600">
                  Continue
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}