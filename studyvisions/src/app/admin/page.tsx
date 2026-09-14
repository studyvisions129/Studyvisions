import { Users, ShoppingBag, Banknote, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalUsers, activeStudents, totalOrders, revenueAggregation, recentOrders] = await Promise.all([
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
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })
  ]);

  const totalRevenue = Number(revenueAggregation._sum.total || 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-800">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+20.1%</span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Students</p>
              <h3 className="text-3xl font-bold text-slate-800">{activeStudents}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+18.2%</span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Sales</p>
              <h3 className="text-3xl font-bold text-slate-800">+12,234</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+19%</span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Users (All)</p>
              <h3 className="text-3xl font-bold text-slate-800">{totalUsers}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">Updated just now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Placeholder for charts/tables */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center flex-col">
          <div className="text-slate-400 mb-2">
            <TrendingUp className="w-12 h-12 opacity-20" />
          </div>
          <h3 className="text-lg font-medium text-slate-600">Revenue Overview</h3>
          <p className="text-sm text-slate-400">Chart visualization will be implemented here</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[var(--sv-border)] text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sv-border)]">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-slate-500">No recent orders.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{order.orderNumber}</td>
                    <td className="p-4 text-slate-600">{order.user?.fullName || 'Unknown User'}</td>
                    <td className="p-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-slate-800">₹{Number(order.total).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
