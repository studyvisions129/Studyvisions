import Link from "next/link";
import {
  GraduationCap,
  MonitorPlay,
  Camera,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const socialLinks = [
  { icon: MonitorPlay, href: "#", label: "YouTube", color: "hover:text-red-400" },
  {
    icon: Camera,
    href: "#",
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    icon: MessageSquare,
    href: "#",
    label: "Facebook",
    color: "hover:text-blue-400",
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--sv-secondary)] text-slate-400 relative overflow-hidden">
      {/* Gradient Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--sv-primary)] via-purple-500 to-[var(--sv-accent)]" />

      {/* Subtle background mesh */}
      <div className="absolute inset-0 hero-mesh opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--sv-primary)] to-[#8b5cf6] flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Study<span className="text-[var(--sv-primary-light)]">Visions</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
              High-quality, affordable digital learning resources for Indian
              students. Apna future yahan se build karo.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 ${social.color} transition-all duration-200 hover:bg-slate-700 hover:scale-105`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[var(--sv-primary-light)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Row */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm justify-between">
            <div className="flex gap-6">
              <a
                href="mailto:hello@studyvisions.in"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--sv-primary)]" />
                hello@studyvisions.in
              </a>
            </div>
            <div className="flex gap-4">
               {/* Note: This is an additional layout to handle responsive footer bottom layout as required */}
               <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
               <Link href="#" className="hover:text-white transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} StudyVisions. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Made with ❤️ for Indian Students
          </p>
        </div>
      </div>
    </footer>
  );
}
