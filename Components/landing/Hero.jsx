import Link from "next/link";
import HeroImg from "../../public/Learning-pana.svg"

export default function Hero() {
  return (
    <section className="flex items-center gap-10 px-10 pt-20 pb-16">

         <div className="w-[600px]">
        <img src={HeroImg.src} alt="Hero" className="w-full" />
        </div>


        <div className="w-full">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                AI-powered learning, made for Filipinos
            </div>
            <h1 className="text-5xl font-serif font-normal leading-tight tracking-tight mb-5">
                Learn smarter with your own{" "}
                <em className="text-emerald-600 not-italic">AI teacher</em>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mb-8 font-light">
                Lumina PH adapts to your course, year level, and learning style —
                giving you personalized lessons, quizzes, and a 24/7 AI tutor built
                just for you.
            </p>
            <div className="flex gap-3 items-center">
                <Link href="/signup">
                <button className="bg-emerald-600 text-white text-sm px-7 py-3 rounded-xl hover:bg-emerald-700">
                    Start learning free
                </button>
                </Link>
                <a href="#how-it-works">
                <button className="text-sm text-gray-500 border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50">
                    See how it works
                </button>
                </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">No credit card needed · Free to start</p>
        </div>
     
    </section>
  );
}