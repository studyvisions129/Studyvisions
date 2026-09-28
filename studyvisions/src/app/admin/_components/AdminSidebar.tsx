"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { 
  LayoutDashboard, Package, Layers, BookOpen, GraduationCap, BookText, 
  LayoutTemplate, Image as ImageIcon, ShoppingCart, Users, Ticket, PenTool, 
  Search, Settings, LogOut, Megaphone, ShieldAlert, TrendingUp, BarChart3, 
  Bell, ListChecks, DollarSign, Tag, Globe, Activity, Filter, Magnet, 
  Mail, MessageSquare, Headphones, ShoppingBag, Database, Shield, FileText, 
  CreditCard, HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

// Types for navigation
type NavItem = { name: string; href: string; icon: React.ElementType };
type NavGroup = { title: string; items: NavItem[] };

export default function AdminSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  
  const sidebarGroups: NavGroup[] = [
    {
      title: "COMMAND CENTER",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Business Analytics", href: "/admin/analytics", icon: TrendingUp },
        { name: "Growth Center", href: "/admin/growth", icon: BarChart3 },
        { name: "Alerts", href: "/admin/alerts", icon: Bell },
      ]
    },
    {
      title: "CREATE",
      items: [
        { name: "Product Planner", href: "/admin/product-planner", icon: ListChecks },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Courses", href: "/admin/courses", icon: GraduationCap },
        { name: "Notes", href: "/admin/notes", icon: BookText },
        { name: "Ebooks", href: "/admin/ebooks", icon: BookOpen },
        { name: "Free Content", href: "/admin/free-content", icon: Layers },
        { name: "Blog", href: "/admin/blog", icon: PenTool },
        { name: "Media Library", href: "/admin/media", icon: ImageIcon },
      ]
    },
    {
      title: "SELL",
      items: [
        { name: "Landing Pages", href: "/admin/landing-pages", icon: LayoutTemplate },
        { name: "Offers & Bundles", href: "/admin/offers", icon: ShoppingBag },
        { name: "Checkout", href: "/admin/checkout-config", icon: ShoppingCart },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Payments", href: "/admin/payments", icon: DollarSign },
        { name: "Coupons", href: "/admin/coupons", icon: Tag },
      ]
    },
    {
      title: "MARKETING",
      items: [
        { name: "Ads Manager", href: "/admin/ads", icon: Megaphone },
        { name: "Ads Tracker", href: "/admin/ads-tracker", icon: Activity },
        { name: "Campaigns", href: "/admin/campaigns", icon: Globe },
        { name: "Attribution", href: "/admin/attribution", icon: Magnet },
        { name: "Funnels", href: "/admin/funnels", icon: Filter },
        { name: "Leads", href: "/admin/leads", icon: Users },
        { name: "Abandoned Checkout", href: "/admin/abandoned-checkout", icon: ShoppingCart },
        { name: "Marketing Automation", href: "/admin/automation", icon: Mail },
      ]
    },
    {
      title: "CUSTOMERS",
      items: [
        { name: "Students", href: "/admin/students", icon: Users },
        { name: "CRM", href: "/admin/crm", icon: Database },
        { name: "Segments", href: "/admin/segments", icon: Layers },
        { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
        { name: "Support", href: "/admin/support", icon: Headphones },
      ]
    },
    {
      title: "CONTENT / SEO",
      items: [
        { name: "Blog", href: "/admin/blog-seo", icon: PenTool },
        { name: "SEO", href: "/admin/seo", icon: Search },
        { name: "Free Resources", href: "/admin/free-resources", icon: BookOpen },
      ]
    },
    {
      title: "MARKETPLACE",
      items: [
        { name: "Sellers Hub", href: "/admin/sellers", icon: Users },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Integrations", href: "/admin/integrations", icon: Globe },
        { name: "Security Center", href: "/admin/security", icon: ShieldAlert },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
        { name: "Expenses", href: "/admin/expenses", icon: CreditCard },
        { name: "Backups", href: "/admin/backups", icon: HardDrive },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    }
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

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {sidebarGroups.map((group, index) => (
          <div key={index}>
            <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm",
                      isActive 
                        ? "bg-indigo-500/10 text-indigo-400" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-4 h-4 transition-transform duration-300", 
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
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0a0f1d] mt-auto shrink-0">
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium transition-all duration-300 group">
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm">Secure Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
