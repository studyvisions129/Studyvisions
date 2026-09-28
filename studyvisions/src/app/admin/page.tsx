import { Users, ShoppingBag, Banknote, TrendingUp, TrendingDown, Clock, Activity, Box, Search, MoreVertical, CreditCard, Magnet, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  
  // Placeholders for unconnected backend metrics
  const placeholderMoney = { todayRev: 0, monthRev: totalRevenue, avgOrderVal: totalOrders > 0 ? totalRevenue / totalOrders : 0, refunds: 0, netRev: totalRevenue };
  const placeholderMarketing = { adSpend: 0, visitors: 0, leads: 0, purchases: totalOrders, cac: 0, roas: 0, conversionRate: 0 };
  const placeholderCustomer = { newCust: activeStudents, returningCust: 0, totalCust: activeStudents, repeatRate: 0, ltv: 0 };
  const placeholderHealth = { grossRev: totalRevenue, paymentFees: 0, hosting: 0, otherExp: 0, netProfit: totalRevenue };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-1">Real-time business intelligence and operational metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            System Online
          </div>
        </div>
      </div>

      {/* LEVEL 1 - MONEY */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-indigo-600" />
          LEVEL 1 — MONEY
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard title="Today's Revenue" value={`₹${placeholderMoney.todayRev.toLocaleString()}`} isPlaceholder />
          <MetricCard title="This Month" value={`₹${placeholderMoney.monthRev.toLocaleString()}`} />
          <MetricCard title="Orders" value={totalOrders.toString()} />
          <MetricCard title="Average Order Value" value={`₹${Math.round(placeholderMoney.avgOrderVal).toLocaleString()}`} />
          <MetricCard title="Refunds" value={`₹${placeholderMoney.refunds.toLocaleString()}`} isPlaceholder />
          <MetricCard title="Net Revenue" value={`₹${placeholderMoney.netRev.toLocaleString()}`} highlight />
        </div>
      </section>

      {/* LEVEL 2 - MARKETING */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Magnet className="w-5 h-5 text-blue-600" />
          LEVEL 2 — MARKETING
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard title="Ad Spend" value={`₹${placeholderMarketing.adSpend.toLocaleString()}`} isPlaceholder />
          <MetricCard title="Visitors" value={placeholderMarketing.visitors.toString()} isPlaceholder />
          <MetricCard title="Leads" value={placeholderMarketing.leads.toString()} isPlaceholder />
          <MetricCard title="Purchases" value={placeholderMarketing.purchases.toString()} />
          <MetricCard title="CAC" value={`₹${placeholderMarketing.cac}`} isPlaceholder />
          <MetricCard title="ROAS" value={placeholderMarketing.roas.toString()} isPlaceholder />
          <MetricCard title="Conversion Rate" value={`${placeholderMarketing.conversionRate}%`} isPlaceholder />
        </div>
      </section>

      {/* LEVEL 3 - CUSTOMER */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          LEVEL 3 — CUSTOMER
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="New Customers" value={placeholderCustomer.newCust.toString()} />
          <MetricCard title="Returning Customers" value={placeholderCustomer.returningCust.toString()} isPlaceholder />
          <MetricCard title="Total Customers" value={placeholderCustomer.totalCust.toString()} />
          <MetricCard title="Repeat Purchase Rate" value={`${placeholderCustomer.repeatRate}%`} isPlaceholder />
          <MetricCard title="Customer LTV" value={`₹${placeholderCustomer.ltv}`} isPlaceholder />
        </div>
      </section>

      {/* LEVEL 4 - BUSINESS HEALTH */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          LEVEL 4 — BUSINESS HEALTH
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="max-w-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Gross Revenue</span>
              <span className="font-bold">₹{placeholderHealth.grossRev.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500 text-sm">
              <span>- Refunds</span>
              <span>₹{placeholderHealth.refunds || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500 text-sm">
              <span>- Payment Fees</span>
              <span className="text-amber-600">(UI Placeholder) ₹{placeholderHealth.paymentFees}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500 text-sm">
              <span>- Ad Spend</span>
              <span className="text-amber-600">(UI Placeholder) ₹{placeholderMarketing.adSpend}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500 text-sm">
              <span>- Hosting & Exp</span>
              <span className="text-amber-600">(UI Placeholder) ₹{placeholderHealth.hosting}</span>
            </div>
            <div className="flex justify-between py-3 mt-2 text-lg">
              <span className="font-bold text-slate-800">Net Profit</span>
              <span className="font-bold text-emerald-600">₹{placeholderHealth.netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, highlight = false, isPlaceholder = false }: { title: string, value: string, highlight?: boolean, isPlaceholder?: boolean }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden",
      highlight && "bg-indigo-50 border-indigo-100 shadow-indigo-100",
      isPlaceholder && "border-dashed bg-slate-50/50"
    )}>
      {isPlaceholder && (
        <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
          Not Connected
        </span>
      )}
      <p className="text-slate-500 text-xs font-medium mb-1 truncate">{title}</p>
      <h3 className={cn("text-xl md:text-2xl font-bold tracking-tight", highlight ? "text-indigo-700" : "text-slate-900")}>
        {value}
      </h3>
    </div>
  );
}
