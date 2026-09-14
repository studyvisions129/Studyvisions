export const dynamic = 'force-dynamic';
import Link from "next/link";
import { BookOpen, Clock, Download, Star, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (dbUser && (dbUser.role === "ADMIN" || dbUser.role === "SUPER_ADMIN")) {
    redirect("/admin");
  }

  // Fetch real products instead of mock data
  const myProducts = await prisma.product.findMany({
    take: 2,
    include: {
      academicLevel: true,
    }
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[var(--sv-border)] p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{dbUser?.fullName || 'Student Name'}</h3>
            <p className="text-xs text-slate-500">{dbUser?.email || 'Free Account'}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-[var(--sv-primary)] font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/dashboard/library" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <BookOpen className="w-5 h-5 text-slate-400" />
            My Library
          </Link>
          <Link href="/dashboard/downloads" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Download className="w-5 h-5 text-slate-400" />
            Downloads
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
        </nav>

        <div className="mt-10 border-t border-slate-100 pt-4">
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-2xl font-bold text-[var(--sv-secondary)] mb-8">Welcome back! 👋</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-[var(--sv-border)] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Enrolled Courses</p>
                <p className="text-2xl font-bold text-slate-800">{myProducts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--sv-border)] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Learning Hours</p>
                <p className="text-2xl font-bold text-slate-800">12.5h</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--sv-border)] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Certificates</p>
                <p className="text-2xl font-bold text-slate-800">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases / Continue Learning */}
        <h2 className="text-xl font-bold text-slate-800 mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myProducts.map((product) => {
            const productBg = product.academicLevel?.color ? `bg-gradient-to-r ${product.academicLevel.color}` : 'bg-gradient-to-br from-slate-500 to-slate-600';
            return (
              <div key={product.id} className="bg-white rounded-2xl p-6 border border-[var(--sv-border)] shadow-sm flex flex-col sm:flex-row gap-6">
                <div className={`w-full sm:w-32 h-32 rounded-xl ${productBg} shrink-0 flex items-center justify-center p-4`}>
                   <span className="text-white font-bold text-center leading-tight">{product.title}</span>
                </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                    {product.type}
                  </span>
                  <span className="text-xs font-medium text-slate-500">CBSE {product.academicLevel?.name || ''}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 leading-tight">{product.title}</h3>
                
                <div className="mt-auto pt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span className="font-medium text-blue-600">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <Link href={`/products/${product.slug}`} className="block text-center w-full py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-100 transition-colors">
                    Resume
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
