import Link from "next/link";
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
  LogOut
} from "lucide-react";

export default function AdminSidebar({ className = "" }: { className?: string }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Boards", href: "/admin/boards", icon: BookOpen },
    { name: "Classes", href: "/admin/classes", icon: GraduationCap },
    { name: "Subjects", href: "/admin/subjects", icon: BookText },
    { name: "Landing Pages", href: "/admin/landing-pages", icon: LayoutTemplate },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Blog", href: "/admin/blog", icon: PenTool },
    { name: "SEO", href: "/admin/seo", icon: Search },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-[var(--sv-border)] flex flex-col h-full shrink-0 overflow-y-auto ${className}`}>
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--sv-primary)] rounded-lg flex items-center justify-center text-white font-bold">
            SV
          </div>
          <span className="font-bold text-xl text-[var(--sv-secondary)]">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <item.icon className="w-5 h-5 text-slate-400" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--sv-border)]">
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
