import { 
  Users, ShoppingBag, Banknote, TrendingUp, TrendingDown, Clock, 
  Activity, Box, Search, MoreVertical, CreditCard, Magnet, AlertCircle,
  Calendar, ChevronDown, Download, PieChart, BarChart3, Filter,
  ArrowUpRight, ArrowDownRight, ArrowRight, Target, FileText, Bell, CheckCircle2, Zap
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
  
  // Real or calculated metrics
  const grossRevenue = totalRevenue;
  const refunds = 0;
  const netSalesRevenue = grossRevenue - refunds;
  
  // Expenses tracking
  const paymentGatewayFees = Math.round(netSalesRevenue * 0.02); // Mock 2%
  const taxes = Math.round(netSalesRevenue * 0.18); // Mock 18% GST
  const adSpend = 0;
  const affiliatePayout = 0;
  const hosting = 0;
  const softwareTools = 0;
  const otherExpenses = 0;
  
  const netProfit = netSalesRevenue - paymentGatewayFees - taxes - adSpend - affiliatePayout - hosting - softwareTools - otherExpenses;
  const profitMargin = netSalesRevenue > 0 ? ((netProfit / netSalesRevenue) * 100).toFixed(1) : "0.0";
  
  const aov = totalOrders > 0 ? netSalesRevenue / totalOrders : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* HEADER & GLOBAL DATE SYSTEM */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
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

      {/* ACTION CENTER / NEEDS ATTENTION */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Action Center
          </h2>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> 2 Critical</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 4 Warnings</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 3 Recommendations</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard icon={AlertCircle} color="rose" title="Meta Ads Disconnected" desc="Connect now" action="Connect" />
          <ActionCard icon={AlertCircle} color="amber" title="Payment Gateway in Test Mode" desc="Activate live mode" action="Activate" />
          <ActionCard icon={TrendingDown} color="amber" title="ROAS below target" desc="View campaign details" action="View" />
          <ActionCard icon={CheckCircle2} color="emerald" title="12 orders received" desc="Processing required" action="Fulfill" />
        </div>
      </section>

      {/* LEVEL 1 - MONEY */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Banknote className="w-6 h-6 text-emerald-500" />
          LEVEL 1 — MONEY
        </h2>

        {/* Primary Financial KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard title="Gross Revenue" value={`₹${grossRevenue.toLocaleString()}`} compare="18.4%" compareDirection="up" />
          <MetricCard title="Refunds" value={`₹${refunds.toLocaleString()}`} />
          <MetricCard title="Net Revenue" value={`₹${netSalesRevenue.toLocaleString()}`} highlight compare="22.1%" compareDirection="up" />
          <MetricCard title="Orders" value={totalOrders.toString()} compare="12.2%" compareDirection="up" />
          <MetricCard title="Average Order Value" value={`₹${Math.round(aov).toLocaleString()}`} compare="3.5%" compareDirection="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Graph Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Revenue Trend</h3>
              <select className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                <option>Hourly</option>
                <option selected>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end px-4 gap-2 pb-4 pt-10 relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-400 font-medium text-sm flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Interactive Chart Placeholder</span>
              </div>
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-100 rounded-t-md relative group hover:bg-indigo-200 transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{h}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Money Flow */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effects */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Activity className="w-5 h-5 text-emerald-400" />
              Money Flow
            </h3>
            <div className="space-y-3 relative z-10">
              <FlowRow label="Gross Revenue" value={`₹${grossRevenue.toLocaleString()}`} />
              <FlowRow label="Refunds" value={`- ₹${refunds}`} isSub />
              <div className="h-px bg-slate-800/80 my-3"></div>
              <FlowRow label="Net Sales Revenue" value={`₹${netSalesRevenue.toLocaleString()}`} isHighlight />
              <FlowRow label="Gateway Fees" value={`- ₹${paymentGatewayFees}`} isSub badge="Auto" />
              <FlowRow label="Taxes" value={`- ₹${taxes}`} isSub badge="Auto" />
              <FlowRow label="Ad Spend" value={`- ₹${adSpend}`} isSub badge="Meta/Google" />
              <FlowRow label="Affiliate Payout" value={`- ₹${affiliatePayout}`} isSub badge="Auto" />
              <FlowRow label="Hosting & Infra" value={`- ₹${hosting}`} isSub badge="Manual" />
              <FlowRow label="Software & Tools" value={`- ₹${softwareTools}`} isSub badge="Manual" />
              <FlowRow label="Other Expenses" value={`- ₹${otherExpenses}`} isSub badge="Manual" />
              <div className="h-px bg-slate-800/80 my-3"></div>
              <div className="flex justify-between items-center mt-5 mb-1 px-2">
                <span className="text-lg font-bold text-slate-200">Net Profit</span>
                <span className="text-2xl font-black text-emerald-400 drop-shadow-md">₹{netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400 px-2">
                <span>Profit Margin</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{profitMargin}%</span>
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
              <OrderStatBox title="Total" value={totalOrders.toString()} color="slate" />
              <OrderStatBox title="Paid" value={totalOrders.toString()} color="emerald" />
              <OrderStatBox title="Pending" value="0" color="amber" />
              <OrderStatBox title="Failed" value="0" color="rose" />
              <OrderStatBox title="Refunded" value="0" color="rose" />
              <OrderStatBox title="Cancelled" value="0" color="slate" />
              <OrderStatBox title="Disputed" value="0" color="amber" />
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
                  {totalOrders === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                        No sales data available for the selected period.
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-b border-slate-50 group hover:bg-slate-50 cursor-pointer">
                        <td className="px-4 py-3 font-semibold text-slate-800">Class 12 PYQ Bundle <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1 rounded">Demo Data</span></td>
                        <td className="px-4 py-3 text-right text-slate-600">324</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">₹48,276</td>
                      </tr>
                      <tr className="border-b border-slate-50 group hover:bg-slate-50 cursor-pointer">
                        <td className="px-4 py-3 font-semibold text-slate-800">BSEB Topper Notes <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1 rounded">Demo Data</span></td>
                        <td className="px-4 py-3 text-right text-slate-600">287</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">₹42,913</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2 - MARKETING & FUNNEL */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Magnet className="w-6 h-6 text-blue-500" />
          LEVEL 2 — MARKETING
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard title="Ad Spend" value="₹0" />
          <MetricCard title="Visitors" value="0" />
          <MetricCard title="Leads" value="0" />
          <MetricCard title="Purchases" value={totalOrders.toString()} />
          <MetricCard title="CAC" value="₹0" />
          <MetricCard title="ROAS" value="0.0x" />
          <MetricCard title="Conv. Rate" value="0%" />
          <MetricCard title="CTR" value="0%" />
          <MetricCard title="CPC" value="₹0" />
          <MetricCard title="CPM" value="₹0" />
          <MetricCard title="ATC" value="0" />
          <MetricCard title="Checkout Start" value="0" />
          <MetricCard title="Cost per Lead" value="₹0" />
          <MetricCard title="Rev per Visitor" value="₹0" />
        </div>

        {/* Funnel & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Digital Product Funnel</h3>
            <div className="space-y-1">
              <FunnelStep step="Ad Impressions" value="100,000" drop="-" />
              <FunnelStep step="Clicks" value="4,500" drop="4.5%" />
              <FunnelStep step="Landing Page Visitors" value="3,800" drop="84.4%" />
              <FunnelStep step="Product Views" value="620" drop="16.3%" />
              <FunnelStep step="Add to Cart" value="310" drop="50.0%" />
              <FunnelStep step="Checkout Started" value="210" drop="67.7%" />
              <FunnelStep step="Payment Attempt" value="180" drop="85.7%" />
              <FunnelStep step="Purchase" value="148" drop="82.2%" isFinal />
            </div>
            <p className="text-xs text-center text-slate-400 mt-4 italic">*Demo funnel data</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Source-wise Revenue</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <SourceRow source="Meta Ads" revenue="₹0" />
              <SourceRow source="Google Ads" revenue="₹0" />
              <SourceRow source="YouTube" revenue="₹0" />
              <SourceRow source="Instagram" revenue="₹0" />
              <SourceRow source="Facebook" revenue="₹0" />
              <SourceRow source="Organic Search" revenue={`₹${netSalesRevenue.toLocaleString()}`} percent={100} />
              <SourceRow source="Direct" revenue="₹0" />
              <SourceRow source="Referral" revenue="₹0" />
              <SourceRow source="Affiliate" revenue="₹0" />
              <SourceRow source="Email" revenue="₹0" />
              <SourceRow source="WhatsApp" revenue="₹0" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Campaign Performance</h3>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">Campaign Name</th>
                    <th className="px-4 py-3 text-right">Spend</th>
                    <th className="px-4 py-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                      No active campaigns found.
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MetricCard title="First-Time Buyers" value={activeStudents.toString()} />
          <MetricCard title="Returning Buyers" value="0" />
          <MetricCard title="Total Customers" value={activeStudents.toString()} />
          <MetricCard title="Repeat Purchase Rate" value="0%" />
          <MetricCard title="Customer Acq. Cost" value="₹0" />
          <MetricCard title="Avg Customer LTV" value={`₹${Math.round(aov).toLocaleString()}`} />
          <MetricCard title="Customer Retention" value="0%" />
          <MetricCard title="Refund Rate" value="0%" />
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
              <button className="text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">Settings</button>
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Monthly Revenue Target</span>
                  <span className="text-slate-500">₹{netSalesRevenue.toLocaleString()} / ₹5L</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${Math.min((netSalesRevenue/500000)*100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Monthly Orders Target</span>
                  <span className="text-slate-500">{totalOrders} / 2,000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${Math.min((totalOrders/2000)*100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Monthly Profit Target</span>
                  <span className="text-slate-500">₹{netProfit.toLocaleString()} / ₹2L</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${Math.min((netProfit/200000)*100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Expense Tracking
              <Link href="/admin/expenses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Manage</Link>
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
              <ExpenseRow title="Hosting & Servers" type="Recurring" amount="₹0" />
              <ExpenseRow title="Software & AI Tools" type="Monthly" amount="₹0" />
              <ExpenseRow title="Content Creation" type="One-time" amount="₹0" />
              <ExpenseRow title="Freelancers" type="One-time" amount="₹0" />
              <ExpenseRow title="Legal & Accounting" type="Yearly" amount="₹0" />
              <ExpenseRow title="Other Expenses" type="One-time" amount="₹0" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Components
function MetricCard({ title, value, highlight = false, compare, compareDirection }: { title: string, value: string, highlight?: boolean, compare?: string, compareDirection?: 'up'|'down' }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer",
      highlight && "bg-indigo-50 border-indigo-100 shadow-indigo-100 hover:border-indigo-400"
    )}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      <h3 className={cn("text-xl md:text-2xl font-black tracking-tight truncate", highlight ? "text-indigo-700" : "text-slate-900")}>
        {value}
      </h3>
      {compare && (
         <div className={cn(
           "flex items-center gap-1 mt-2 text-xs font-bold",
           compareDirection === 'up' ? "text-emerald-600" : "text-rose-600"
         )}>
           {compareDirection === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} 
           <span>{compareDirection === 'up' ? '+' : '-'}{compare}</span>
         </div>
      )}
    </div>
  );
}

function ActionCard({ icon: Icon, color, title, desc, action }: any) {
  const colorStyles: any = {
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };
  return (
    <div className={cn("p-4 rounded-xl border flex flex-col justify-between", colorStyles[color])}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <h4 className="font-bold text-sm leading-tight">{title}</h4>
        </div>
        <p className="text-xs opacity-80 mb-3">{desc}</p>
      </div>
      <button className="text-xs font-bold uppercase tracking-wider bg-white/50 hover:bg-white/80 py-1.5 rounded transition-colors">{action} →</button>
    </div>
  )
}

function FlowRow({ label, value, isSub = false, isHighlight = false, badge }: any) {
  return (
    <div className="flex justify-between items-center text-sm transition-colors hover:bg-white/5 -mx-2 px-2 py-1.5 rounded-xl cursor-default">
      <span className={cn(
        isSub ? "text-slate-400 pl-4 relative before:content-[''] before:absolute before:w-2 before:h-px before:bg-slate-700 before:left-0 before:top-1/2" : "font-semibold text-slate-200",
        isHighlight && "text-emerald-400 font-bold text-base drop-shadow-sm"
      )}>
        {label}
        {badge && <span className="ml-2 text-[9px] bg-slate-800/80 border border-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{badge}</span>}
      </span>
      <span className={cn(
        isHighlight ? "font-bold text-emerald-400 text-base drop-shadow-sm" : "font-medium text-slate-300"
      )}>{value}</span>
    </div>
  );
}

function OrderStatBox({ title, value, color }: any) {
  const colorStyles: any = {
    slate: "bg-slate-50 border-slate-100 text-slate-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
  };
  return (
    <div className={cn("p-3 rounded-2xl border", colorStyles[color])}>
      <p className="text-xs font-semibold mb-1 uppercase tracking-wider opacity-80">{title}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  )
}

function FunnelStep({ step, value, drop, isFinal }: any) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="w-16 text-right text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">{drop}</div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-0.5 h-4 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
        <div className={cn("w-full py-1.5 rounded-lg text-center text-xs font-semibold border", isFinal ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600")}>
          {step}
        </div>
      </div>
      <div className="w-16 font-bold text-sm text-slate-700">{value}</div>
    </div>
  )
}

function SourceRow({ source, revenue, percent = 0 }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-1.5">
        <span className="text-slate-700">{source}</span>
        <span className={percent === 0 ? "text-slate-400" : "text-slate-900"}>{revenue}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn("h-1.5 rounded-full", percent === 0 ? "bg-slate-300" : "bg-blue-500")} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ExpenseRow({ title, type, amount }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Box className="w-4 h-4"/></div>
        <div>
          <p className="text-sm font-bold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{type}</p>
        </div>
      </div>
      <span className="font-bold text-slate-700">{amount}</span>
    </div>
  )
}
