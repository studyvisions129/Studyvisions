"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap,
  Menu,
  X,
  Search,
  User,
  BookOpen,
  LayoutDashboard,
  LogIn,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[var(--sv-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            id="navbar-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--sv-primary)] to-[#8b5cf6] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--sv-secondary)] tracking-tight">
              Study<span className="text-gradient">Visions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--sv-text-muted)] hover:text-[var(--sv-primary)] rounded-lg hover:bg-blue-50/60 transition-all duration-200"
                id={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className={`bg-[var(--sv-surface-dim)] rounded-full py-2 pl-10 pr-4 text-sm border border-transparent focus:border-[var(--sv-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-300 ${
                  searchOpen ? "w-64 opacity-100" : "w-48 opacity-100"
                }`}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                id="navbar-search"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sv-text-muted)]" />
            </div>

            {/* Login Button */}
            <Link
              href="/auth/login"
              className="btn-primary flex items-center gap-2 text-sm !py-2 !px-5"
              id="navbar-login"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="navbar-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--sv-border)] bg-white/95 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-[var(--sv-primary)] hover:bg-blue-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 btn-primary w-full text-sm !py-3"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              Login / Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
