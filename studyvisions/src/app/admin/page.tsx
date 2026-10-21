import { 
  Users, ShoppingBag, Banknote, TrendingUp, TrendingDown, Clock, 
  Activity, Box, Search, MoreVertical, CreditCard, Magnet, AlertCircle,
  Calendar, ChevronDown, Download, PieChart, BarChart3, Filter,
  ArrowUpRight, ArrowDownRight, ArrowRight, Target, FileText, Bell, CheckCircle2, Zap,
  ExternalLink, ShieldCheck, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import GlobalDateFilter from "./_components/GlobalDateFilter";
import RevenueTrendChart from "./_components/RevenueTrendChart";
import { getDateRangeBoundaries, getComparisonBoundaries, MetricComparison } from "@/lib/date-utils";
import { 
  getDashboardFinancialReport,
  getTopProductsReport,
  getCustomerAnalyticsReport,
  getFunnelAnalyticsReport,
  getSourceWiseRevenueReport,
  getBusinessTargetProgress,
  getRevenueTrendData
} from "@/lib/services/financial-calculations";
import { getActionCenterAlerts } from "@/lib/services/action-center";

export const dynamic = "force-dynamic";

interface AdminDashboardPageProps {
  searchParams?: Promise<{
    range?: string;
    compare?: string;
    from?: string;
    to?: string;
    interval?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const rangeParam = resolvedParams.range || "This Month";
  const compareParam = resolvedParams.compare || "Previous Period";
  const intervalParam = (resolvedParams.interval?.toLowerCase() as any) || "daily";

  // 1. Calculate authoritative date and comparison boundaries in IST
  const currentRange = getDateRangeBoundaries(rangeParam, resolvedParams.from, resolvedParams.to);
  const compareRange = getComparisonBoundaries(currentRange, compareParam as any);

  // 2. Fetch all real data concurrently
  const [
    financialReport,
    actionCenter,
    topProducts,
    customerAnalytics,
    funnelAnalytics,
    targetProgress,
    trendData
  ] = await Promise.all([
    getDashboardFinancialReport(currentRange, compareRange),
    getActionCenterAlerts(),
    getTopProductsReport(currentRange.from, currentRange.to),
    getCustomerAnalyticsReport(currentRange.from, currentRange.to),
    getFunnelAnalyticsReport(currentRange.from, currentRange.to),
    getBusinessTargetProgress(0, 0, 0), // will update with current metrics below
    getRevenueTrendData(currentRange.from, currentRange.to, intervalParam)
  ]);

  const { current, comparisons, hasAnyTransactions } = financialReport;

  // 3. Compute real target progress with current window figures
  const dynamicTargetProgress = await getBusinessTargetProgress(
    current.netSalesRevenue,
    current.completedOrdersCount,
    current.netProfit
  );

  // 4. Source-wise revenue
  const sourceRevenue = await getSourceWiseRevenueReport(
    currentRange.from,
    currentRange.to,
    current.netSalesRevenue,
    current.completedOrdersCount
  );

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
              Production Database Active
            </span>
            <span className="text-xs text-slate-500 font-medium">Asia/Kolkata (IST) • {currentRange.label}</span>
          </div>
        </div>
        
        <GlobalDateFilter />
      </div>

      {/* ACTION CENTER / NEEDS ATTENTION */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Action Center
          </h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> {actionCenter.criticalCount} Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {actionCenter.warningCount} Warnings
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {actionCenter.recommendationCount} Recommendations
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCenter.alerts.slice(0, 4).map((alert) => (
            <ActionCard 
              key={alert.id}
              icon={alert.severity === "critical" ? AlertCircle : alert.severity === "warning" ? TrendingDown : CheckCircle2}
              color={alert.severity === "critical" ? "rose" : alert.severity === "warning" ? "amber" : "emerald"}
              title={alert.title}
              desc={alert.description}
              action={alert.actionLabel}
              href={alert.actionHref}
              badge={alert.badge}
            />
          ))}
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
          <MetricCard 
            title="Gross Revenue" 
            value={`₹${current.grossRevenue.toLocaleString("en-IN")}`} 
            comparison={comparisons.grossRevenue}
          />
          <MetricCard 
            title="Refunds" 
            value={`₹${current.refunds.toLocaleString("en-IN")}`} 
            comparison={comparisons.refunds}
            href="/admin/orders?status=Refunded"
          />
          <MetricCard 
            title="Net Revenue" 
            value={`₹${current.netSalesRevenue.toLocaleString("en-IN")}`} 
            highlight 
            comparison={comparisons.netRevenue}
          />
          <MetricCard 
            title="Orders" 
            value={current.completedOrdersCount.toString()} 
            comparison={comparisons.orders}
            href="/admin/orders?status=Paid"
          />
          <MetricCard 
            title="Average Order Value" 
            value={`₹${current.averageOrderValue.toLocaleString("en-IN")}`} 
            comparison={comparisons.aov}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Graph */}
          <div className="lg:col-span-2">
            <RevenueTrendChart 
              data={trendData}
              currentInterval={intervalParam.charAt(0).toUpperCase() + intervalParam.slice(1)}
            />
          </div>

          {/* Money Flow */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effects */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <h3 className="font-bold text-white mb-6 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Money Flow
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                Audited
              </span>
            </h3>
            <div className="space-y-2.5 relative z-10 text-xs">
              <FlowRow label="Gross Revenue" value={`₹${current.grossRevenue.toLocaleString("en-IN")}`} />
              <FlowRow label="Discounts" value={`- ₹${current.discounts.toLocaleString("en-IN")}`} isSub badge="Coupon" />
              <FlowRow label="Refunds" value={`- ₹${current.refunds.toLocaleString("en-IN")}`} isSub />
              <div className="h-px bg-slate-800/80 my-2"></div>
              <FlowRow label="Net Sales Revenue" value={`₹${current.netSalesRevenue.toLocaleString("en-IN")}`} isHighlight />
              <FlowRow label="Gateway Fees" value={`- ₹${current.paymentGatewayFees.toLocaleString("en-IN")}`} isSub badge="2% Razorpay" />
              <FlowRow label="Taxes" value={`- ₹${current.taxes.toLocaleString("en-IN")}`} isSub badge="18% GST" />
              <FlowRow label="Ad Spend" value={`- ₹${current.adSpend.toLocaleString("en-IN")}`} isSub badge="Meta/Google" />
              <FlowRow label="Hosting & Infra" value={`- ₹${current.expenses.hostingAndServers.toLocaleString("en-IN")}`} isSub badge="Recorded" />
              <FlowRow label="Software & Tools" value={`- ₹${current.expenses.softwareAndTools.toLocaleString("en-IN")}`} isSub badge="Recorded" />
              <FlowRow label="Other Expenses" value={`- ₹${(current.expenses.contentCreation + current.expenses.freelancers + current.expenses.legalAndAccounting + current.expenses.otherExpenses).toLocaleString("en-IN")}`} isSub badge="Recorded" />
              <div className="h-px bg-slate-800/80 my-2"></div>
              <div className="flex justify-between items-center mt-4 mb-1 px-2">
                <span className="text-base font-bold text-slate-200">Net Profit</span>
                <span className="text-2xl font-black text-emerald-400 drop-shadow-md">
                  ₹{current.netProfit.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 px-2">
                <span>Profit Margin</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                  {current.profitMargin}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Analytics & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Orders Analytics
              <Link href="/admin/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
              <OrderStatBox title="Total" value={current.totalOrdersCount.toString()} color="slate" href="/admin/orders" />
              <OrderStatBox title="Paid" value={current.completedOrdersCount.toString()} color="emerald" href="/admin/orders?status=Paid" />
              <OrderStatBox title="Pending" value={current.pendingOrdersCount.toString()} color="amber" href="/admin/orders?status=Pending" />
              <OrderStatBox title="Failed" value={current.failedOrdersCount.toString()} color="rose" href="/admin/orders?status=Failed" />
              <OrderStatBox title="Refunded" value={current.refundedOrdersCount.toString()} color="rose" href="/admin/orders?status=Refunded" />
              <OrderStatBox title="Cancelled" value={current.cancelledOrdersCount.toString()} color="slate" href="/admin/orders?status=Cancelled" />
              <OrderStatBox title="Disputed" value={current.disputedOrdersCount.toString()} color="amber" href="/admin/orders?status=Disputed" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Only completed & paid orders are counted toward recognized revenue.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Top Products
              <span className="text-xs font-semibold text-slate-400">{topProducts.length} ranked</span>
            </h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 font-bold">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">Product</th>
                    <th className="px-4 py-3 text-right">Orders</th>
                    <th className="px-4 py-3 text-right">Units</th>
                    <th className="px-4 py-3 text-right">Refunds</th>
                    <th className="px-4 py-3 text-right">Net Revenue</th>
                    <th className="px-4 py-3 text-right rounded-tr-xl rounded-br-xl">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                        No sales data recorded for the selected period.
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {p.title}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.ordersCount}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.unitsSold}</td>
                        <td className="px-4 py-3 text-right text-rose-500">{p.refundsCount}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                          ₹{p.netRevenue.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-indigo-600">
                          {p.conversionRate > 0 ? `${p.conversionRate}%` : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2 - MARKETING & FUNNEL */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Magnet className="w-6 h-6 text-blue-500" />
            LEVEL 2 — MARKETING
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Ad Spend & Attribution
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard title="Ad Spend" value={`₹${current.adSpend.toLocaleString("en-IN")}`} />
          <MetricCard title="Visitors" value={funnelAnalytics.productViews.toString()} />
          <MetricCard title="Leads" value="0" />
          <MetricCard title="Purchases" value={current.completedOrdersCount.toString()} href="/admin/orders?status=Paid" />
          <MetricCard title="CAC" value={customerAnalytics.customerAcquisitionCost > 0 ? `₹${customerAnalytics.customerAcquisitionCost}` : "₹0"} />
          <MetricCard title="ROAS" value={current.adSpend > 0 ? `${(current.netSalesRevenue / current.adSpend).toFixed(1)}x` : "0.0x"} />
          <MetricCard title="Conv. Rate" value={`${funnelAnalytics.overallConversionRate}%`} />
          <MetricCard title="CTR" value="0%" />
          <MetricCard title="CPC" value="₹0" />
          <MetricCard title="CPM" value="₹0" />
          <MetricCard title="Cart / ATC" value={funnelAnalytics.checkoutsStarted.toString()} />
          <MetricCard title="Checkout Start" value={funnelAnalytics.checkoutsStarted.toString()} />
          <MetricCard title="Cost per Lead" value="₹0" />
          <MetricCard title="Rev per Visitor" value={funnelAnalytics.productViews > 0 ? `₹${Math.round(current.netSalesRevenue / funnelAnalytics.productViews)}` : "₹0"} />
        </div>

        {/* Funnel & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital Product Funnel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Digital Product Funnel
              <span className="text-xs text-indigo-600 font-bold">{funnelAnalytics.overallConversionRate}% Overall</span>
            </h3>
            
            <div className="space-y-3 py-2">
              <FunnelStep 
                step="Product Views" 
                value={funnelAnalytics.productViews.toString()} 
                drop="100%" 
              />
              <FunnelStep 
                step="Checkouts Started" 
                value={funnelAnalytics.checkoutsStarted.toString()} 
                drop={funnelAnalytics.productViews > 0 ? `${funnelAnalytics.viewToCheckoutRate}%` : "0%"} 
              />
              <FunnelStep 
                step="Payment Initiated" 
                value={funnelAnalytics.paymentsInitiated.toString()} 
                drop={funnelAnalytics.checkoutsStarted > 0 ? `${funnelAnalytics.checkoutToPaymentRate}%` : "0%"} 
              />
              <FunnelStep 
                step="Payment Succeeded" 
                value={funnelAnalytics.paymentsSuccessful.toString()} 
                drop={funnelAnalytics.paymentsInitiated > 0 ? `${funnelAnalytics.paymentToSuccessRate}%` : "0%"} 
              />
              <FunnelStep 
                step="Access Granted" 
                value={funnelAnalytics.purchasesGranted.toString()} 
                drop="100%" 
                isFinal 
              />
            </div>
            
            <p className="text-[11px] text-slate-400 mt-4 text-center">
              Aggregated from authentic client and checkout analytics events.
            </p>
          </div>

          {/* Source-wise Revenue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Source-wise Revenue
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attribution</span>
            </h3>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase px-2 mb-2">
              <div className="w-1/3 text-left">Source</div>
              <div className="w-1/6 text-right">Revenue</div>
              <div className="w-1/6 text-right">Orders</div>
              <div className="w-1/6 text-right">Spend</div>
              <div className="w-1/6 text-right">ROAS</div>
            </div>
            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {sourceRevenue.map((sr) => (
                <SourceRow 
                  key={sr.source}
                  source={sr.source} 
                  revenue={`₹${sr.revenue.toLocaleString("en-IN")}`} 
                  orders={sr.orders.toString()} 
                  spend={`₹${sr.spend}`} 
                  roas={sr.roas} 
                  isVerified={sr.isVerified}
                />
              ))}
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Campaign Performance
              <Link href="/admin/settings" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                Setup Ads
              </Link>
            </h3>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 font-bold">
                  <tr>
                    <th className="px-3 py-2.5 rounded-l-lg">Platform</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right rounded-r-lg">Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="px-3 py-3 font-semibold text-slate-800">Meta Ads</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Disconnected
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500">₹0</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-semibold text-slate-800">Google Ads</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Unlinked
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500">₹0</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 mt-2 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Connect ad accounts in Website Settings to sync live PPC campaigns.
                </p>
              </div>
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MetricCard 
            title="First-Time Buyers" 
            value={customerAnalytics.firstTimeBuyers.toString()} 
            href="/admin/students" 
          />
          <MetricCard 
            title="Returning Buyers" 
            value={customerAnalytics.returningBuyers.toString()} 
            href="/admin/students" 
          />
          <MetricCard 
            title="Purchasing Customers" 
            value={customerAnalytics.totalPurchasingCustomers.toString()} 
            href="/admin/students" 
          />
          <MetricCard 
            title="Repeat Purchase Rate" 
            value={`${customerAnalytics.repeatPurchaseRate}%`} 
          />
          <MetricCard 
            title="Customer Acq. Cost" 
            value={`₹${customerAnalytics.customerAcquisitionCost}`} 
          />
          <MetricCard 
            title="Avg Customer LTV" 
            value={`₹${customerAnalytics.averageCustomerLTV.toLocaleString("en-IN")}`} 
          />
          <MetricCard 
            title="Customer Retention" 
            value={`${customerAnalytics.customerRetentionRate}%`} 
          />
          <MetricCard 
            title="Refund Rate" 
            value={`${customerAnalytics.refundRate}%`} 
            href="/admin/orders?status=Refunded"
          />
        </div>
      </section>

      {/* LEVEL 4 - BUSINESS HEALTH */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-500" />
          LEVEL 4 — BUSINESS HEALTH
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Targets */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
              Business Targets
              <Link 
                href="/admin/targets" 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
              >
                Settings
              </Link>
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Monthly Revenue Target</span>
                  <span className="text-slate-500">
                    ₹{current.netSalesRevenue.toLocaleString("en-IN")} / ₹{dynamicTargetProgress.monthlyRevenueTarget.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${dynamicTargetProgress.revenuePercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  {dynamicTargetProgress.revenuePercent}% achieved
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Monthly Orders Target</span>
                  <span className="text-slate-500">
                    {current.completedOrdersCount} / {dynamicTargetProgress.monthlyOrdersTarget}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${dynamicTargetProgress.ordersPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  {dynamicTargetProgress.ordersPercent}% achieved
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Monthly Profit Target</span>
                  <span className="text-slate-500">
                    ₹{current.netProfit.toLocaleString("en-IN")} / ₹{dynamicTargetProgress.monthlyProfitTarget.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${dynamicTargetProgress.profitPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  {dynamicTargetProgress.profitPercent}% achieved
                </span>
              </div>
            </div>
          </div>

          {/* Expense Tracking */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Expense Tracking
              <Link href="/admin/expenses" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors">
                Manage Expenses
              </Link>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <ExpenseCard title="Hosting & Servers" amount={`₹${current.expenses.hostingAndServers.toLocaleString("en-IN")}`} />
              <ExpenseCard title="Software & Tools" amount={`₹${current.expenses.softwareAndTools.toLocaleString("en-IN")}`} />
              <ExpenseCard title="Marketing & Ads" amount={`₹${current.expenses.marketingAndAds.toLocaleString("en-IN")}`} />
              <ExpenseCard title="Content Creation" amount={`₹${current.expenses.contentCreation.toLocaleString("en-IN")}`} />
              <ExpenseCard title="Freelancers" amount={`₹${current.expenses.freelancers.toLocaleString("en-IN")}`} />
              <ExpenseCard title="Legal & Accounting" amount={`₹${current.expenses.legalAndAccounting.toLocaleString("en-IN")}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-4 text-right">
              Total Recorded Operating Expenses: <span className="font-bold text-slate-700">₹{current.expenses.totalOperatingExpenses.toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

// UI Components
function MetricCard({ 
  title, 
  value, 
  highlight = false, 
  comparison, 
  href 
}: { 
  title: string; 
  value: string; 
  highlight?: boolean; 
  comparison?: MetricComparison; 
  href?: string; 
}) {
  const content = (
    <div className={cn(
      "bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer h-full",
      highlight && "bg-indigo-50 border-indigo-100 shadow-indigo-100 hover:border-indigo-400"
    )}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      <h3 className={cn("text-xl md:text-2xl font-black tracking-tight truncate", highlight ? "text-indigo-700" : "text-slate-900")}>
        {value}
      </h3>
      {comparison && (
        <div className="mt-2">
          {comparison.hasInsufficientData ? (
            <span className="text-[10px] font-bold text-slate-400">Baseline period</span>
          ) : (
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold",
              comparison.direction === "up" ? "text-emerald-600" : comparison.direction === "down" ? "text-rose-600" : "text-slate-500"
            )}>
              {comparison.direction === "up" ? <TrendingUp className="w-3 h-3" /> : comparison.direction === "down" ? <TrendingDown className="w-3 h-3" /> : null} 
              <span>{comparison.formattedChange}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

function ActionCard({ icon: Icon, color, title, desc, action, href, badge }: any) {
  const colorStyles: any = {
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };
  return (
    <div className={cn("p-4 rounded-xl border flex flex-col justify-between", colorStyles[color])}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <h4 className="font-bold text-xs leading-tight">{title}</h4>
          </div>
          {badge && <span className="text-[9px] font-bold uppercase bg-white/70 px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
        <p className="text-[11px] opacity-80 mb-3">{desc}</p>
      </div>
      {href ? (
        <Link 
          href={href} 
          className="text-[11px] font-bold uppercase tracking-wider bg-white/60 hover:bg-white/90 py-1.5 px-3 rounded text-center transition-colors block"
        >
          {action} →
        </Link>
      ) : (
        <span className="text-[11px] font-bold uppercase tracking-wider bg-white/40 py-1.5 px-3 rounded text-center block">
          {action}
        </span>
      )}
    </div>
  );
}

function FlowRow({ label, value, isSub = false, isHighlight = false, badge }: any) {
  return (
    <div className="flex justify-between items-center text-xs transition-colors hover:bg-white/5 -mx-2 px-2 py-1 rounded-lg cursor-default">
      <span className={cn(
        isSub ? "text-slate-400 pl-4 relative before:content-[''] before:absolute before:w-2 before:h-px before:bg-slate-700 before:left-0 before:top-1/2" : "font-semibold text-slate-200",
        isHighlight && "text-emerald-400 font-bold text-sm drop-shadow-sm"
      )}>
        {label}
        {badge && <span className="ml-2 text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1 py-0.5 rounded uppercase font-bold tracking-wider">{badge}</span>}
      </span>
      <span className={cn(
        isHighlight ? "font-bold text-emerald-400 text-sm drop-shadow-sm" : "font-medium text-slate-300"
      )}>{value}</span>
    </div>
  );
}

function OrderStatBox({ title, value, color, href }: any) {
  const colorStyles: any = {
    slate: "bg-slate-50 border-slate-100 text-slate-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
  };
  const content = (
    <div className={cn("p-3 rounded-2xl border transition-colors hover:shadow-md cursor-pointer", colorStyles[color])}>
      <p className="text-[10px] font-semibold mb-1 uppercase tracking-wider opacity-80">{title}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

function FunnelStep({ step, value, drop, isFinal }: any) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="w-14 text-right text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
        {drop}
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-0.5 h-3 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
        <div className={cn(
          "w-full py-1.5 rounded-xl text-center text-xs font-semibold border transition-all",
          isFinal ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-700"
        )}>
          {step}
        </div>
      </div>
      <div className="w-14 font-black text-xs text-slate-800 text-right">{value}</div>
    </div>
  );
}

function SourceRow({ source, revenue, orders, spend, roas, isVerified }: any) {
  return (
    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50 hover:bg-slate-50 px-2 rounded-lg transition-colors group cursor-default">
      <div className="w-1/3 flex items-center gap-1.5 truncate">
        <span className="font-semibold text-slate-800 truncate">{source}</span>
        {isVerified ? (
          <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1 rounded font-bold uppercase">Verified</span>
        ) : (
          <span className="text-[9px] bg-slate-100 text-slate-400 px-1 rounded font-bold uppercase">Unlinked</span>
        )}
      </div>
      <div className="w-1/6 text-right font-bold text-slate-900 truncate">{revenue}</div>
      <div className="w-1/6 text-right text-slate-500 truncate">{orders}</div>
      <div className="w-1/6 text-right text-slate-500 truncate">{spend}</div>
      <div className="w-1/6 text-right font-bold text-indigo-600 truncate">{roas}</div>
    </div>
  );
}

function ExpenseCard({ title, amount }: { title: string; amount: string }) {
  return (
    <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
      <div className="flex items-center gap-2.5 truncate">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Box className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs font-bold text-slate-700 truncate">{title}</p>
      </div>
      <span className="font-black text-xs text-slate-900 shrink-0">{amount}</span>
    </div>
  );
}
