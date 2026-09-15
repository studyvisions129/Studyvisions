import { Search, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { MobileAdminSidebar } from "./MobileAdminSidebar";
import AdminSidebar from "./AdminSidebar";

export default function AdminTopBar({ className = "" }: { className?: string }) {
  return (
    <header className={`h-16 bg-white border-b border-[var(--sv-border)] flex items-center justify-between px-4 md:px-6 shrink-0 z-10 ${className}`}>
      <div className="flex-1 flex items-center">
        <MobileAdminSidebar>
          <AdminSidebar />
        </MobileAdminSidebar>
        
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--sv-primary)] focus:border-[var(--sv-primary)] sm:text-sm transition-colors"
            placeholder="Search products, users, orders..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
        </button>

        <Link 
          href="/admin/products/new" 
          className="hidden sm:flex items-center gap-2 bg-[var(--sv-primary)] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--sv-primary-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </Link>

        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
