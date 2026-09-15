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
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, {dbUser?.fullName?.split(' ')[0] || 'Student'}! 👋</h1>
        <p className="text-slate-500">Continue your learning journey today.</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Link href="/dashboard/library" className="bg-white rounded-2xl p-5 border border-[var(--sv-border)] shadow-sm hover:border-[var(--sv-primary)] hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-[var(--sv-primary)] group-hover:text-white transition-colors text-[var(--sv-primary)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">My Library</p>
        </Link>
        <Link href="/dashboard/downloads" className="bg-white rounded-2xl p-5 border border-[var(--sv-border)] shadow-sm hover:border-[var(--sv-primary)] hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
            <Download className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">Downloads</p>
        </Link>
        <Link href="/dashboard/history" className="bg-white rounded-2xl p-5 border border-[var(--sv-border)] shadow-sm hover:border-[var(--sv-primary)] hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">Purchase History</p>
        </Link>
        <Link href="/categories" className="bg-white rounded-2xl p-5 border border-[var(--sv-border)] shadow-sm hover:border-[var(--sv-primary)] hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600">
            <Star className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">Browse Notes</p>
        </Link>
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

    </div>
  );
}
