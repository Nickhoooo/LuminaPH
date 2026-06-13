import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 lg:px-10 py-5 border-b border-gray-100">
      <div className="text-xl font-serif">
        Lumina<span className="text-emerald-600">PH</span>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 text-sm text-gray-500">
        <a href="#features" className="hover:text-gray-800">Features</a>
        <a href="#how-it-works" className="hover:text-gray-800">How it works</a>
        <a href="#subjects" className="hover:text-gray-800">Subjects</a>
      </div>
      
      {/* CTA Button */}
      <Link href="/signup">
        <button className="bg-emerald-600 text-white text-sm px-4 lg:px-5 py-2 rounded-lg hover:bg-emerald-700 whitespace-nowrap">
          Get started
        </button>
      </Link>
    </nav>
  );
}