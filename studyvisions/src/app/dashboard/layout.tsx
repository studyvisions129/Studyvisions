import Link from "next/link";
import { BookOpen, Download, Settings, LayoutDashboard, LogOut, Bell, Search, GraduationCap } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">
              Study<span className="text-blue-500">Visions</span>
            </span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex max-w-md w-full mx-8 relative">
          <input 
            type="text" 
            placeholder="Search notes, subjects, blogs..." 
            className="w-full bg-slate-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent transition-all"
          />
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {dbUser?.fullName?.charAt(0).toUpperCase() || 'S'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col py-6 shrink-0">
          <div className="px-6 mb-6">
            <h3 className="font-bold text-slate-800 truncate">{dbUser?.fullName || 'Student Name'}</h3>
            <p className="text-xs text-slate-500 truncate">{dbUser?.email || 'Free Account'}</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="/dashboard/library" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-sm">
              <BookOpen className="w-5 h-5 text-slate-400" />
              My Library
            </Link>
            <Link href="/dashboard/downloads" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-sm">
              <Download className="w-5 h-5 text-slate-400" />
              Downloads
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-sm">
              <Settings className="w-5 h-5 text-slate-400" />
              Settings
            </Link>
          </nav>

          <div className="px-4 mt-auto">
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors text-sm">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (per SMAB) */}
      <nav className="md:hidden border-t border-slate-200 bg-white flex justify-around p-2 shrink-0 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-blue-600">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/dashboard/library" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">Library</span>
        </Link>
        <Link href="/dashboard/downloads" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900">
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-medium">Downloads</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
