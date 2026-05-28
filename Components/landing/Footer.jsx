import { Mail, MapPin, Phone, Code, ArrowRight } from 'lucide-react'

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
      { label: "Documentation", href: "/docs" },
      { label: "FAQ", href: "/faq" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  }

  const socialLinks = [
    { text: "GitHub", href: "https://github.com/luminaph" },
    { text: "Twitter", href: "https://twitter.com/luminaph" },
    { text: "Facebook", href: "https://facebook.com/luminaph" },
    { text: "TikTok", href: "https://tiktok.com/@luminaph" },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      
      {/* Newsletter Section */}
    

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <h2 className="text-xl font-bold text-white">Lumina
                <span className='text-amber-600'>PH</span></h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Empowering Filipino students with AI-powered personalized learning.
            </p>
            
            {/* Social Links - Text Based */}
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.text}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-800 text-white rounded-full hover:bg-violet-600 transition-colors"
                >
                  {social.text}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-violet-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a href="mailto:support@luminaph.com" className="text-white hover:text-violet-400">
                  support@luminaph.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <a href="tel:+63912345678" className="text-white hover:text-violet-400">
                  +63 (912) 345-6789
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">Manila, Philippines</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} LuminaPH. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-violet-400">
                Privacy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-violet-400">
                Terms
              </a>
              <a href="/sitemap" className="text-gray-400 hover:text-violet-400">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}