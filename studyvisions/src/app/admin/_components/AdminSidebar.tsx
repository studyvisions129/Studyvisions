"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  BookText, 
  LayoutTemplate, 
  Image as ImageIcon, 
  ShoppingCart, 
  Users, 
  Ticket, 
  PenTool, 
  Search, 
  Settings,
  LogOut,
  ChevronRight,
  Megaphone,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Free Content", href: "/admin/free-content", icon: BookOpen },
    { name: "Ads Manager", href: "/admin/ads", icon: Megaphone },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Boards", href: "/admin/boards", icon: BookOpen },
    { name: "Classes", href: "/admin/classes", icon: GraduationCap },
    { name: "Subjects", href: "/admin/subjects", icon: BookText },
    { name: "Landing Pages", href: "/admin/landing-pages", icon: LayoutTemplate },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Promotions", href: "/admin/promotions", icon: Ticket },
    { name: "Blog", href: "/admin/blog", icon: PenTool },
    { name: "SEO", href: "/admin/seo", icon: Search },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-72 bg-[#0a0f1d] border-r border-slate-800 flex flex-col h-full shrink-0 overflow-y-auto shadow-xl transition-all duration-300", className)}>
      <div className="p-6 sticky top-0 bg-[#0a0f1d]/95 backdrop-blur-sm z-10 border-b border-slate-800/50">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            SV
          </div>
          <span className="font-bold text-xl text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            StudyVisions
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-300",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300", 
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300",
                  isActive && "scale-110"
                )} />
                <span className={cn("transition-colors duration-300", isActive && "font-semibold")}>
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </Link>
          );
        })}

        {/* Marketplace Section */}
        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            Marketplace <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Beta</span>
          </h3>
          <div className="space-y-1">
            {(() => {
              const isActive = pathname === "/admin/sellers" || pathname.startsWith("/admin/sellers");
              return (
                <Link
                  href="/admin/sellers"
                  className={cn(
                    "group flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-300",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Users className={cn(
                      "w-5 h-5 transition-transform duration-300", 
                      isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300",
                      isActive && "scale-110"
                    )} />
                    <span className={cn("transition-colors duration-300", isActive && "font-semibold")}>
                      Sellers Hub
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </Link>
              );
            })()}
          </div>
        </div>

        {/* Security & System Section */}
        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</h3>
          <div className="space-y-1">
            {(() => {
              const isActive = pathname === "/admin/security";
              return (
                <Link
                  href="/admin/security"
                  className={cn(
                    "group flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-300",
                    isActive 
                      ? "bg-rose-500/10 text-rose-400" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className={cn(
                      "w-5 h-5 transition-transform duration-300", 
                      isActive ? "text-rose-400" : "text-slate-500 group-hover:text-slate-300",
                      isActive && "scale-110"
                    )} />
                    <span className={cn("transition-colors duration-300", isActive && "font-semibold")}>
                      Security Center
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </Link>
              );
            })()}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0a0f1d] mt-auto">
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium transition-all duration-300 group">
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Secure Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
