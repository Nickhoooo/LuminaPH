import Image from "next/image";
import HowItWorkImg from "../../public/Innovation-amico-1.svg"

const HowItWork = [
  {
    num: "1", title: "Create your profile", tuts: "Sign up and tell us your course, year level, and how you like to learn."
  },
  {
    num: "2", title: "AI generates your subjects", tuts: "Based on your profile, your AI teacher builds a personalized set of subjects and lessons just for you." 
  },
  {
    num: "3", title: "Learn, ask, and grow", tuts: "Read lessons, chat with your AI teacher, take quizzes, and earn XP as you go."
  },
  {
    num: "4", title: "Connect with others", tuts: "Join the global chat, share insights, and learn alongside fellow Filipino students."
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-100 py-16 bg-gray-50 flex gap-35">

      <div className="w-[500px] border-1 rounded-3xl flex flex-col p-[20px] gap-6">
  {/* Header */}
  <div className="flex flex-col gap-4">
    <div className="w-fit flex items-center border-0 rounded-full p-2 gap-2 bg-violet-300 pl-3 pr-4">
      <div className="w-3 h-3 rounded-full bg-violet-600"></div>
      <p className="text-[12px] font-medium">How it Works</p>
    </div>
    
    <div>
      <p className="text-[32px] font-bold">Up and running in minutes</p>
      <p className="text-[14px] text-gray-600">Tell us about yourself  we'll handle the rest.</p>
    </div>
  </div>

  {/* Steps Container */}
  <div className="flex flex-col gap-4">
    {HowItWork.map((step) => (
      <div 
        key={step.num} 
        className="bg-gray-600 rounded-2xl p-4 flex items-start gap-6 text-white"
      >
        {/* Large Number */}
        <p className="text-[48px] font-bold min-w-fit opacity-80">{step.num}</p>
        
        {/* Content */}
        <div className="flex flex-col gap-2">
          <p className="text-[16px] font-semibold">{step.title}</p>
          <p className="text-[12px] opacity-90">{step.tuts}</p>
        </div>
      </div>
    ))}
  </div>
  
</div>
<Image src={HowItWorkImg} alt="How it works" width={400} height={400} />


    </section>
  );
}