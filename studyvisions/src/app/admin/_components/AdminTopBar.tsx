import { Search, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { MobileAdminSidebar } from "./MobileAdminSidebar";
import AdminSidebar from "./AdminSidebar";

export default function AdminTopBar({ className = "" }: { className?: string }) {
  return (
    <header className={`h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 md:px-8 shrink-0 z-10 sticky top-0 ${className}`}>
      <div className="flex-1 flex items-center gap-6">
        <MobileAdminSidebar>
          <AdminSidebar />
        </MobileAdminSidebar>
        
        <div className="relative w-full max-w-lg hidden lg:block group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm"
            placeholder="Search products, users, orders..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all duration-300">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <Link 
          href="/admin/products/new" 
          className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-300 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Quick Add</span>
        </Link>

        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-sm">
              AD
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
