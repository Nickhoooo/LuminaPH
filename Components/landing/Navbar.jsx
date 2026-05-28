import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 border-b border-gray-100">
      <div className="text-xl font-serif">
        Lumina<span className="text-amber-600">PH</span>
      </div>
      <div className="flex gap-8 text-sm text-gray-500">
        <a href="#features" className="hover:text-gray-800">Features</a>
        <a href="#how-it-works" className="hover:text-gray-800">How it works</a>
        <a href="#subjects" className="hover:text-gray-800">Subjects</a>
      </div>
      <Link href="/signup">
        <button className="bg-emerald-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-emerald-700">
          Get started
        </button>
      </Link>
    </nav>
  );
}