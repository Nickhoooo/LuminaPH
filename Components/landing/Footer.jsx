import { Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "AI Teacher", href: "#ai-teacher" },
      { label: "Leaderboard", href: "#leaderboard" },
    ],
    Learn: [
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Docs", href: "/docs" },
      { label: "FAQ", href: "/faq" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  }

  const socialLinks = [
    { text: "GitHub", href: "https://github.com/Nickhoooo" },
    { text: "Twitter", href: "https://twitter.com/luminaph" },
    { text: "Facebook", href: "https://facebook.com/luminaph" },
    { text: "TikTok", href: "https://tiktok.com/@luminaph" },
  ]

  return (
    <footer className="bg-[#0f1a14] text-gray-400">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h2 className="text-lg font-semibold text-white">
                Lumina<span className="text-emerald-600">PH</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-5 max-w-[220px]">
              AI-powered personalized learning for Filipino students.
            </p>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.text}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-semibold bg-emerald-950 text-emerald-100 rounded-full hover:bg-emerald-900 transition-colors"
                >
                  {s.text}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-emerald-50 tracking-wide mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-emerald-950 pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <a href="mailto:support@luminaph.com" className="text-emerald-100 hover:text-emerald-400 transition-colors">
              support@luminaph.com
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <p className="text-xs text-gray-600">© {currentYear} LuminaPH. All rights reserved.</p>
            <div className="flex gap-5 text-xs">
              <a href="/privacy" className="text-gray-600 hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-600 hover:text-emerald-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}