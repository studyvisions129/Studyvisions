"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  User,
  Phone,
} from "lucide-react";
import { signup } from "../actions";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signup, null);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 py-16 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-[var(--sv-border)] p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--sv-primary)] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--sv-secondary)]">
              Create Account
            </h1>
            <p className="text-[var(--sv-text-muted)] text-sm mt-1">
              Apna naya account banao aur learning start karo
            </p>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[var(--sv-border)] hover:border-[var(--sv-primary)] hover:bg-blue-50/50 transition-all duration-200 font-medium text-[var(--sv-secondary)] mb-6"
            id="register-google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--sv-border)]" />
            <span className="text-xs text-[var(--sv-text-muted)] uppercase tracking-wider font-medium">Or</span>
            <div className="flex-1 h-px bg-[var(--sv-border)]" />
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-200">
                {state.error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="fullName" placeholder="Aapka pura naam" className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--sv-border)] focus:border-[var(--sv-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all" id="register-name" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" placeholder="aapka@email.com" className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--sv-border)] focus:border-[var(--sv-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all" id="register-email" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--sv-border)] focus:border-[var(--sv-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all" id="register-phone" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Min 8 characters" className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-[var(--sv-border)] focus:border-[var(--sv-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all" id="register-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[var(--sv-primary)] focus:ring-[var(--sv-primary)]" />
              <span className="text-sm text-slate-600">
                Main <Link href="/terms" className="text-[var(--sv-primary)] hover:underline">Terms & Conditions</Link> aur <Link href="/privacy" className="text-[var(--sv-primary)] hover:underline">Privacy Policy</Link> se agree karta/karti hoon.
              </span>
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full !py-3 text-center text-sm disabled:opacity-70" id="register-submit">
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--sv-text-muted)] mt-6">
            Pehle se account hai?{" "}
            <Link href="/auth/login" className="text-[var(--sv-primary)] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
