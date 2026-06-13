import Image from "next/image";
import HowItWorkImg from "../../public/Innovation-amico-1.svg"

const HowItWork = [
  {
    num: "1", 
    title: "Sign up in 60 seconds", 
    tuts: "Tell us your course, year level, and learning style."
  },
  {
    num: "2", 
    title: "AI generates your subjects", 
    tuts: "Based on your profile, your AI teacher builds personalized subjects and lessons."
  },
  {
    num: "3", 
    title: "Learn, ask, and grow", 
    tuts: "Read lessons, chat with your AI teacher, take quizzes, and earn XP."
  },
  {
    num: "4", 
    title: "Connect with others", 
    tuts: "Join the global chat, share insights, and learn alongside fellow Filipinos."
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 lg:px-10 py-12 lg:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="w-fit flex items-center rounded-full p-2 gap-2 bg-violet-100 pl-3 pr-4 mb-4">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <p className="text-xs lg:text-sm font-medium text-violet-700">How it Works</p>
          </div>
          
          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Up and running in minutes
            </p>
            <p className="text-sm lg:text-base text-gray-600">
              Tell us about yourself — we'll handle the rest.
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Steps */}
          <div className="flex flex-col gap-4">
            {HowItWork.map((step) => (
              <div 
                key={step.num} 
                className="bg-gray-800 rounded-2xl p-4 lg:p-6 flex items-start gap-4 lg:gap-6 text-white hover:bg-gray-700 transition-colors"
              >
                {/* Number */}
                <p className="text-3xl lg:text-5xl font-bold min-w-fit opacity-60">{step.num}</p>
                
                {/* Content */}
                <div className="flex flex-col gap-1 lg:gap-2 flex-1">
                  <p className="text-sm lg:text-base font-semibold">{step.title}</p>
                  <p className="text-xs lg:text-sm opacity-80">{step.tuts}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="hidden lg:block">
            <Image 
              src={HowItWorkImg}
              alt="How it works" 
              className="w-full max-w-md mx-auto"
            />
          </div>

        </div>
      </div>
    </section>
  );
}