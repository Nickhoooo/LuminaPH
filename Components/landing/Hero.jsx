import Link from "next/link";
import HeroImg from "../../public/Learning-pana.svg"

export default function Hero() {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-10 px-4 lg:px-10 py-10 lg:py-20">

      {/* Image — hidden on small phones */}
      <div className="hidden sm:block w-full lg:w-[600px]">
        <img src={HeroImg.src} alt="Hero" className="w-full" />
      </div>

      {/* Content */}
      <div className="w-full">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs px-3 py-1.5 rounded-full mb-4 lg:mb-6 font-medium">
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
          AI-powered learning, made for Filipinos
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal leading-tight tracking-tight mb-4 lg:mb-5">
          Learn smarter with your own{" "}
          <em className="text-emerald-600 not-italic">AI teacher</em>
        </h1>

        <p className="text-base lg:text-lg text-gray-500 leading-relaxed mb-6 lg:mb-8 font-light">
          Lumina PH adapts to your course, year level, and learning style —
          giving you personalized lessons, quizzes, and a 24/7 AI tutor.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
          <Link href="/signup">
            <button className="w-full sm:w-auto bg-emerald-600 text-white text-sm px-6 lg:px-7 py-3 rounded-xl hover:bg-emerald-700">
              Start learning free
            </button>
          </Link>
          <a href="#how-it-works">
            <button className="w-full sm:w-auto text-sm text-gray-500 border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50">
              See how it works
            </button>
          </a>
        </div>

        <p className="text-xs text-gray-400">No credit card needed · Free to start</p>
      </div>
    </section>
  );
}