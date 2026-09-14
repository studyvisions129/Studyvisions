import { Users, ShoppingBag, Banknote, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count();
  const activeStudents = await prisma.user.count({
    where: { role: "STUDENT" }
  });

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
              <h3 className="text-3xl font-bold text-slate-800">₹45,231.89</h3>
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
            <span className="text-green-500 font-medium">+180.1%</span>
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

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center flex-col">
          <div className="text-slate-400 mb-2">
            <ShoppingBag className="w-12 h-12 opacity-20" />
          </div>
          <h3 className="text-lg font-medium text-slate-600">Recent Orders</h3>
          <p className="text-sm text-slate-400">Data table will be implemented here</p>
        </div>
      </div>
    </div>
  );
}
