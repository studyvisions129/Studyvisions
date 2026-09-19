import { Users, ShoppingBag, Banknote, TrendingUp, TrendingDown, Clock, Activity, Box, Search, MoreVertical } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [totalUsers, activeStudents, totalOrders, revenueAggregation, recentOrders, recentUsers, totalProducts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { role: "STUDENT" }
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true }
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { role: "STUDENT" }
    }),
    prisma.product.count()
  ]);

  const totalRevenue = Number(revenueAggregation._sum.total || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time business insights and operational metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            System Online
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-2">Total Revenue</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
              <Banknote className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              +20.1%
            </span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-2">Total Students</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{activeStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
              <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.5%
            </span>
            <span className="text-slate-400 ml-2">new registrations</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-2">Total Orders</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{totalOrders}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
              <ShoppingBag className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.2%
            </span>
            <span className="text-slate-400 ml-2">conversion rate</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden text-white">
          <div className="hero-mesh absolute inset-0 opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-2">Active Products</p>
              <h3 className="text-4xl font-bold tracking-tight">{totalProducts}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <Link href="/admin/products" className="text-white hover:text-indigo-100 font-medium flex items-center gap-1 group/link">
              Manage Catalog
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-sm text-slate-500 mt-1">Latest purchases across the platform.</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                        <p>No recent orders found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {order.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{order.user?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{order.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                        order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      )}>
                        {order.status === 'PAID' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity / Users Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-900">New Signups</h3>
              <p className="text-sm text-slate-500 mt-1">Recently joined students.</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {recentUsers.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <Users className="w-12 h-12 mb-3 opacity-20" />
                 <p className="text-sm">No recent signups.</p>
               </div>
            ) : (
              recentUsers.map((user, idx) => (
                <div key={user.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 relative">
                    <span className="font-bold text-slate-600 text-sm">{user.fullName?.charAt(0) || 'U'}</span>
                    {idx === 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))
            )}
            
            <Link href="/admin/students" className="mt-auto block w-full py-3 text-center text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-colors">
              View All Students
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
