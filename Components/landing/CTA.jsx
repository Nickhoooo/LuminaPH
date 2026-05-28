import Link from "next/link";
import { ArrowRight, Sparkles, Users } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-6 lg:px-10 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-12 md:p-16 text-white">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 bg-emerald-400 bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium text-emerald-800">Free to get started</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Ready to transform your learning?
            </h2>

            {/* Subheading */}
            <p className="text-lg text-emerald-50 mb-2 max-w-2xl leading-relaxed">
              Join thousands of Filipino students already learning with their personal AI teacher.
            </p>
            <p className="text-emerald-50 mb-8 max-w-2xl">
              Get personalized lessons, quizzes, and earn XP while you learn — no credit card required.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-white border-opacity-20">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-emerald-50">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-emerald-50">Personalized</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-emerald-50">AI Teacher</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="flex-1">
                <button className="w-full bg-white text-emerald-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group">
                  Start learning free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#how-it-works" className="flex-1">
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-emerald-600 font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 backdrop-blur-sm border border-white border-opacity-30">
                  See how it works
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-emerald-50">
              <Users className="w-4 h-4" />
              <span>Trusted by Filipino students and teachers</span>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">Questions?</p>
          <Link href="/contact">
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center justify-center gap-2 mx-auto">
              Contact our support team
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}