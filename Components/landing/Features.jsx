import { Brain, BookOpen, ClipboardList, MessageSquare, Zap, TrendingUp } from 'lucide-react'
import Image from "next/image";
import FeatureIllustration from "../../public/Innovation-pana.svg"

const features = [
  {
    id: 1,
    icon: Brain,
    title: "AI teacher",
    color: "text-blue-500",
    description: "Ask anything, anytime. Your AI teacher explains topics based on your level and course."
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Personalized lessons",
    color: "text-orange-400",
    description: "Lessons are generated based on your course, year level, and learning style."
  },
  {
    id: 3,
    icon: ClipboardList,
    title: "AI-generated quizzes",
    color: "text-red-400",
    description: "Test your knowledge with quizzes made from your lessons. Get instant feedback."
  },
  {
    id: 4,
    icon: MessageSquare,
    title: "Global chat",
    color: "text-teal-500",
    description: "Connect with students across all subjects in one shared community space."
  },
  {
    id: 5,
    icon: Zap,
    title: "XP & leaderboard",
    color: "text-orange-400",
    description: "Earn XP for every lesson and quiz. Climb the leaderboard and stay motivated."
  },
  {
    id: 6,
    icon: TrendingUp,
    title: "Progress tracking",
    color: "text-blue-500",
    description: "See exactly how far you've come and what's left to complete per subject."
  }
]

export default function Features() {
  return (
    <section className="px-6 py-16 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto border-2 border-gray-300 rounded-3xl p-8 md:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
          
          {/* Left Content */}
          <div className="flex-1">
            {/* Features Label */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Features</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Everything you need to{" "}
              <span className="text-green-600">learn better</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg">
              From AI-generated lessons to real-time chat with classmates.{" "}
              <span className="font-semibold">Lumina</span> has it all.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image 
              src={FeatureIllustration} 
              alt="Learning illustration"
              className="w-full max-w-xs h-auto object-contain"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300 rounded-2xl overflow-hidden">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <div
                key={feature.id}
                className={`
                  p-8 flex flex-col items-start gap-4
                  ${index % 3 !== 2 ? 'md:border-r border-gray-300' : ''}
                  ${index < 3 ? 'md:border-b border-gray-300' : ''}
                  ${index % 2 !== 1 && index >= 3 ? 'border-r border-gray-300' : ''}
                  hover:bg-gray-50 transition-colors duration-200
                `}
              >
                {/* Icon */}
                <Icon className="w-10 h-10 text-gray-400" strokeWidth={1.5} />

                {/* Title */}
                <h3 className={`text-lg font-semibold ${feature.color}`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}