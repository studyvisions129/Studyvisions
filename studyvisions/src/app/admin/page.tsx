import { 
  Users, ShoppingBag, Banknote, TrendingUp, TrendingDown, Clock, 
  Activity, Box, Search, MoreVertical, CreditCard, Magnet, AlertCircle,
  Calendar, ChevronDown, Download, PieChart, BarChart3, Filter,
  ArrowUpRight, ArrowDownRight, ArrowRight, Target, FileText, Bell
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

import GlobalDateFilter from "./_components/GlobalDateFilter";

export default async function AdminDashboardPage() {
  // Fetch real data where possible
  const [
    totalUsers, 
    activeStudents, 
    totalOrders, 
    revenueAggregation, 
    recentOrders, 
    recentUsers, 
    totalProducts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { total: true } }),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, where: { role: "STUDENT" } }),
    prisma.product.count()
  ]);

  const totalRevenue = Number(revenueAggregation._sum.total || 0);
  
  // Simulated calculations for UI
  const grossRevenue = totalRevenue;
  const refunds = 0;
  const netRevenue = grossRevenue - refunds;
  const paymentFees = Math.round(netRevenue * 0.02); // Mock 2%
  const adSpend = 0;
  const operatingExpenses = 0;
  const netProfit = netRevenue - paymentFees - adSpend - operatingExpenses;
  const profitMargin = netRevenue > 0 ? ((netProfit / netRevenue) * 100).toFixed(1) : "0.0";
  const aov = totalOrders > 0 ? netRevenue / totalOrders : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* HEADER & GLOBAL DATE SYSTEM */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 z-40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </span>
            <span className="text-sm text-slate-500">Asia/Kolkata (IST)</span>
          </div>
        </div>
        
        <GlobalDateFilter />
      </div>

      {/* LEVEL 1 - MONEY */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-500" />
            LEVEL 1 — MONEY
          </h2>
        </div>

        {/* Primary Financial KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard title="Gross Revenue" value={`₹${grossRevenue.toLocaleString()}`} compare="18.4%" compareDirection="up" />
          <MetricCard title="Refunds" value={`₹${refunds.toLocaleString()}`} isPlaceholder />
          <MetricCard title="Net Revenue" value={`₹${netRevenue.toLocaleString()}`} highlight compare="22.1%" compareDirection="up" />
          <MetricCard title="Orders" value={totalOrders.toString()} compare="12.2%" compareDirection="up" />
          <MetricCard title="Average Order Value" value={`₹${Math.round(aov).toLocaleString()}`} compare="3.5%" compareDirection="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Graph Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Revenue Trend</h3>
              <select className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end px-4 gap-2 pb-4 pt-10 relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-400 font-medium text-sm flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Interactive Chart Placeholder</span>
              </div>
              {/* Dummy bars */}
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-100 rounded-t-md relative group hover:bg-indigo-200 transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{h}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Money Flow / P&L Mini */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Money Flow
            </h3>
            <div className="space-y-4 relative z-10">
              <FlowRow label="Gross Revenue" value={`₹${grossRevenue.toLocaleString()}`} />
              <FlowRow label="Refunds" value={`- ₹${refunds}`} isSub />
              <div className="h-px bg-slate-800 my-2"></div>
              <FlowRow label="Net Revenue" value={`₹${netRevenue.toLocaleString()}`} isHighlight />
              <FlowRow label="Payment Fees" value={`- ₹${paymentFees}`} isSub isPlaceholder />
              <FlowRow label="Ad Spend" value={`- ₹${adSpend}`} isSub isPlaceholder />
              <FlowRow label="Operating Exp" value={`- ₹${operatingExpenses}`} isSub isPlaceholder />
              <div className="h-px bg-slate-800 my-2"></div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-white">Net Profit</span>
                <span className="text-2xl font-black text-emerald-400">₹{netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>Profit Margin</span>
                <span className="font-bold text-white">{profitMargin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Analytics & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Orders Analytics
              <Link href="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View All <ArrowRight className="w-4 h-4"/></Link>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1">Total</p>
                <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600 mb-1">Paid</p>
                <p className="text-xl font-bold text-emerald-700">{totalOrders}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs font-semibold text-amber-600 mb-1">Pending</p>
                <p className="text-xl font-bold text-amber-700">0</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-xs font-semibold text-rose-600 mb-1">Refunded</p>
                <p className="text-xl font-bold text-rose-700">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Top Products
              <button className="text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4"/></button>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">Product</th>
                    <th className="px-4 py-3 text-right">Orders</th>
                    <th className="px-4 py-3 text-right rounded-tr-xl rounded-br-xl">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-50 group hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-slate-800">Class 12 PYQ Bundle</td>
                    <td className="px-4 py-3 text-right text-slate-600">324</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">₹48,276</td>
                  </tr>
                  <tr className="border-b border-slate-50 group hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-slate-800">BSEB Topper Notes</td>
                    <td className="px-4 py-3 text-right text-slate-600">287</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">₹42,913</td>
                  </tr>
                  <tr className="group hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-slate-800">Excel Course</td>
                    <td className="px-4 py-3 text-right text-slate-600">142</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">₹70,858</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2 - MARKETING */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Magnet className="w-6 h-6 text-blue-500" />
          LEVEL 2 — MARKETING
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard title="Ad Spend" value="₹0" isPlaceholder />
          <MetricCard title="Visitors" value="0" isPlaceholder />
          <MetricCard title="Leads" value="0" isPlaceholder />
          <MetricCard title="Purchases" value={totalOrders.toString()} />
          <MetricCard title="CAC" value="₹0" isPlaceholder />
          <MetricCard title="ROAS" value="0.0x" isPlaceholder />
          <MetricCard title="Conversion Rate" value="0%" isPlaceholder />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Source-wise Revenue</h3>
            <div className="space-y-3">
              <SourceRow source="Meta Ads" revenue="₹0" isPlaceholder />
              <SourceRow source="Google Ads" revenue="₹0" isPlaceholder />
              <SourceRow source="Organic" revenue={`₹${netRevenue.toLocaleString()}`} percent={100} />
              <SourceRow source="Direct" revenue="₹0" isPlaceholder />
              <SourceRow source="YouTube" revenue="₹0" isPlaceholder />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Campaign Performance</h3>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">Campaign Name</th>
                    <th className="px-4 py-3 text-right">Spend</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                    <th className="px-4 py-3 text-right">Purchases</th>
                    <th className="px-4 py-3 text-right rounded-tr-xl rounded-br-xl">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                      No active campaigns found for the selected period.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 3 - CUSTOMER */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-500" />
          LEVEL 3 — CUSTOMER
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="New Customers" value={activeStudents.toString()} />
          <MetricCard title="Returning Customers" value="0" isPlaceholder />
          <MetricCard title="Total Customers" value={activeStudents.toString()} />
          <MetricCard title="Repeat Purchase Rate" value="0%" isPlaceholder />
          <MetricCard title="Avg. Customer LTV" value={`₹${Math.round(aov).toLocaleString()}`} isPlaceholder />
        </div>
      </section>

      {/* LEVEL 4 - BUSINESS HEALTH */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-500" />
          LEVEL 4 — BUSINESS HEALTH
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
              Business Targets
              <Target className="w-5 h-5 text-indigo-500" />
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Monthly Revenue</span>
                  <span className="text-slate-500">₹{netRevenue.toLocaleString()} / ₹5L</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${Math.min((netRevenue/500000)*100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Monthly Orders</span>
                  <span className="text-slate-500">{totalOrders} / 2,000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${Math.min((totalOrders/2000)*100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Expense Tracking
              <Link href="/admin/expenses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Manage</Link>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Box className="w-4 h-4"/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Hosting & Servers</p>
                    <p className="text-xs text-slate-500">Manual Entry</p>
                  </div>
                </div>
                <span className="font-bold text-slate-700">₹0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Box className="w-4 h-4"/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Software & AI Tools</p>
                    <p className="text-xs text-slate-500">Manual Entry</p>
                  </div>
                </div>
                <span className="font-bold text-slate-700">₹0</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-3xl border border-rose-100 p-6 shadow-sm">
            <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Real-Time Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Meta Ads Disconnected</p>
                  <p className="text-xs text-slate-500 mt-0.5">Please connect your Meta Business account to sync Ad Spend.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Payment Gateway Warning</p>
                  <p className="text-xs text-slate-500 mt-0.5">Test mode is active. Live transactions are disabled.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  highlight = false, 
  isPlaceholder = false,
  compare,
  compareDirection
}: { 
  title: string, 
  value: string, 
  highlight?: boolean, 
  isPlaceholder?: boolean,
  compare?: string,
  compareDirection?: 'up' | 'down'
}) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer",
      highlight && "bg-indigo-50 border-indigo-100 shadow-indigo-100 hover:border-indigo-400",
      isPlaceholder && "border-dashed bg-slate-50/50 hover:bg-slate-50"
    )}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      <h3 className={cn("text-2xl font-black tracking-tight", highlight ? "text-indigo-700" : "text-slate-900")}>
        {value}
      </h3>
      {isPlaceholder ? (
         <p className="text-[10px] text-amber-600 mt-2 font-semibold bg-amber-100/50 inline-block px-2 py-0.5 rounded">Data Not Connected</p>
      ) : compare ? (
         <div className={cn(
           "flex items-center gap-1 mt-2 text-xs font-bold",
           compareDirection === 'up' ? "text-emerald-600" : "text-rose-600"
         )}>
           {compareDirection === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} 
           <span>{compareDirection === 'up' ? '+' : '-'}{compare}</span>
         </div>
      ) : null}
    </div>
  );
}

function FlowRow({ label, value, isSub = false, isHighlight = false, isPlaceholder = false }: { label: string, value: string, isSub?: boolean, isHighlight?: boolean, isPlaceholder?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={cn(
        isSub ? "text-slate-400 pl-4 relative before:content-[''] before:absolute before:w-2 before:h-px before:bg-slate-600 before:left-0 before:top-1/2" : "font-semibold text-slate-200",
        isHighlight && "text-white font-bold text-base"
      )}>
        {label}
        {isPlaceholder && <span className="ml-2 text-[10px] bg-slate-800 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Unlinked</span>}
      </span>
      <span className={cn(
        isHighlight ? "font-bold text-emerald-400 text-base" : "font-medium text-slate-300"
      )}>{value}</span>
    </div>
  );
}

function SourceRow({ source, revenue, percent = 0, isPlaceholder = false }: { source: string, revenue: string, percent?: number, isPlaceholder?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-1.5">
        <span className="text-slate-700">{source}</span>
        <span className={isPlaceholder ? "text-slate-400" : "text-slate-900"}>{revenue}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn("h-1.5 rounded-full", isPlaceholder ? "bg-slate-300" : "bg-blue-500")} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
