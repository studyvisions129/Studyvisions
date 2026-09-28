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
        
        <div className="relative w-full max-w-lg hidden lg:block group/search">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/search:text-indigo-500">
            <Search className="h-4 w-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm"
            placeholder="Global Search (Press '/' to focus)"
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 invisible group-focus-within/search:opacity-100 group-focus-within/search:visible transition-all duration-200 translate-y-2 group-focus-within/search:translate-y-0 p-3 z-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Products</p>
            <div className="space-y-1 mb-3">
              <Link href="#" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">BSEB Premium Notes <span className="text-slate-400 ml-2">₹199</span></Link>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Customers</p>
            <div className="space-y-1">
              <Link href="#" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">Rahul Kumar <span className="text-slate-400 ml-2">rahul@example.com</span></Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all duration-300">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative group/quickadd hidden sm:block">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            <span>Quick Add</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 invisible group-hover/quickadd:opacity-100 group-hover/quickadd:visible transition-all duration-200 translate-y-2 group-hover/quickadd:translate-y-0 p-2 z-50">
            <Link href="/admin/products/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Product</Link>
            <Link href="/admin/courses/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Course</Link>
            <Link href="/admin/ebooks/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Ebook</Link>
            <Link href="/admin/notes/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Note</Link>
            <Link href="/admin/landing-pages/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Landing Page</Link>
            <Link href="/admin/coupons/new" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium">+ Coupon</Link>
          </div>
        </div>

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
