import Navbar from "@/Components/landing/Navbar";
import Hero from "@/Components/landing/Hero";
import Stats from "@/Components/landing/Stats";
import Features from "@/Components/landing/Features";
import HowItWorks from "@/Components/landing/HowItWorks";
import CTA from "@/Components/landing/CTA";
import Footer from "@/Components/landing/Footer";

export default function Home() {
    return(
        <main className="min-h-screen bg-white font-sans">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </main>
    );
}