import GlobalDateFilter from "../_components/GlobalDateFilter";
import { 
  TrendingUp, TrendingDown, RefreshCcw, CheckCircle2, AlertCircle, 
  BarChart3, PieChart, Activity, Users, ShoppingBag, DollarSign, Filter,
  ArrowRight, Download, Zap, Lightbulb, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import RevenueTab from "./_components/RevenueTab";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage(props: any) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams?.tab || "overview";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* Demo Data Warning */}
      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center justify-center gap-2 text-rose-700 text-sm font-bold shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>This is <span className="uppercase tracking-wider">Demo / Testing Data</span>. Not real business data.</p>
      </div>

      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Business Analytics</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl font-medium">
            Understand your business performance, customers, products and marketing in one place.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <GlobalDateFilter />
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <RefreshCcw className="w-3.5 h-3.5" /> Last synced: 2 min ago
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Sub-navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 custom-scrollbar border-b border-slate-200">
        <Tab href="/admin/analytics?tab=overview" active={currentTab === "overview"}>Overview</Tab>
        <Tab href="/admin/analytics?tab=revenue" active={currentTab === "revenue"}>Revenue</Tab>
        <Tab href="/admin/analytics?tab=products" active={currentTab === "products"}>Products</Tab>
        <Tab href="/admin/analytics?tab=customers" active={currentTab === "customers"}>Customers</Tab>
        <Tab href="/admin/analytics?tab=marketing" active={currentTab === "marketing"}>Marketing</Tab>
        <Tab href="/admin/analytics?tab=funnel" active={currentTab === "funnel"}>Funnel</Tab>
        <Tab href="/admin/analytics?tab=profit" active={currentTab === "profit"}>Profit</Tab>
        <Tab href="/admin/analytics?tab=attribution" active={currentTab === "attribution"}>Attribution</Tab>
        <Tab href="/admin/analytics?tab=reports" active={currentTab === "reports"}>Reports</Tab>
      </div>

      {currentTab === "overview" && (
        <>
        <div className="space-y-6">
        {/* LEVEL 1 — Money */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Level 1 — Money
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard title="Gross Revenue" value="₹1,50,000" trendPct="+20.0%" trendAbs="+₹25,000" trendUp={true} />
            <MetricCard title="Refunds" value="₹5,000" trendPct="+5.0%" trendAbs="+₹238" trendUp={false} />
            <MetricCard title="Net Revenue" value="₹1,45,000" trendPct="+21.3%" trendAbs="+₹25,476" trendUp={true} />
            <MetricCard title="COGS" value="₹20,000" trendPct="0%" trendAbs="₹0" />
            <MetricCard title="Payment Fees" value="₹2,900" trendPct="+21.3%" trendAbs="+₹509" trendUp={false} />
            <MetricCard title="Ad Spend" value="₹30,000" trendPct="+10.0%" trendAbs="+₹2,727" trendUp={false} />
            <MetricCard title="Other Costs" value="₹5,000" trendPct="0%" trendAbs="₹0" />
            <MetricCard title="Net Profit" value="₹87,100" trendPct="+28.5%" trendAbs="+₹19,331" trendUp={true} highlight 
              definition="Gross Sales - Discounts = Net Sales - COGS - Payment Fees - Ad Spend - Affiliate Payouts - Seller Payouts - Hosting & Infrastructure - Software & Tools - Content Creation - Other Operating Expenses - Taxes = Net Profit" />
            <MetricCard title="Profit Margin" value="60%" trendPct="+3.5%" trendAbs="+3.5%" trendUp={true} highlight />
          </div>
        </div>

        {/* LEVEL 2 — Sales */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" /> Level 2 — Sales
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard title="Orders" value="142" trendPct="+12.2%" trendAbs="+15" trendUp={true} />
            <MetricCard title="Avg Order Value" value="₹1,021" trendPct="+8.1%" trendAbs="+₹76" trendUp={true} />
            <MetricCard title="Conversion Rate" value="3.2%" trendPct="-0.4%" trendAbs="-0.4%" trendUp={false} />
            <MetricCard title="Refund Rate" value="3.4%" trendPct="-0.2%" trendAbs="-0.2%" trendUp={true} />
            <MetricCard title="Discounts" value="₹12,400" trendPct="+15.0%" trendAbs="+₹1,617" trendUp={false} />
            <MetricCard title="Coupon Usage" value="48" trendPct="+20.0%" trendAbs="+8" trendUp={true} />
          </div>
        </div>

        {/* LEVEL 3 — Customers */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" /> Level 3 — Customers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard title="Total Customers" value="4,289" trendPct="+3.1%" trendAbs="+129" trendUp={true} />
            <MetricCard title="New Customers" value="118" trendPct="-2.1%" trendAbs="-3" trendUp={false} />
            <MetricCard title="Returning Customers" value="24" trendPct="+14.2%" trendAbs="+3" trendUp={true} />
            <MetricCard title="Repeat Purchase" value="18.4%" trendPct="+1.2%" trendAbs="+1.2%" trendUp={true} 
              definition="Customers with 2+ completed purchases ÷ Customers with at least 1 completed purchase" />
            <MetricCard title="Customer LTV" value="₹3,450" trendPct="+4.5%" trendAbs="+₹148" trendUp={true} highlight 
              definition="Historical Customer Revenue + Expected Future Value" />
            <MetricCard title="CAC" value="₹254" trendPct="-5.2%" trendAbs="-₹14" trendUp={true} highlight 
              definition="Paid CAC (Total Ad Spend ÷ New Customers from Paid)" />
          </div>
        </div>

        {/* LEVEL 4 — Marketing */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Level 4 — Marketing
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <MetricCard title="Ad Spend" value="₹30,000" trendPct="+10.0%" trendAbs="+₹2,727" trendUp={false} />
            <MetricCard title="ROAS" value="4.2x" trendPct="+0.8x" trendAbs="+0.8x" trendUp={true} highlight />
            <MetricCard title="MER" value="4.8x" trendPct="+0.5x" trendAbs="+0.5x" trendUp={true} />
            <MetricCard title="CAC" value="₹254" trendPct="-5.2%" trendAbs="-₹14" trendUp={true} 
              definition="Paid CAC (Total Ad Spend ÷ New Customers from Paid)" />
            <MetricCard title="Organic Revenue" value="₹15,500" trendPct="+42.0%" trendAbs="+₹4,583" trendUp={true} />
            <MetricCard title="Paid Revenue" value="₹1,29,500" trendPct="+18.4%" trendAbs="+₹20,127" trendUp={true} />
            <MetricCard title="Email Revenue" value="₹0" trendPct="0%" trendAbs="₹0" />
          </div>
        </div>
      </div>

      {/* 3. Revenue Trend & Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue Trend
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Revenue</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Orders</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Profit</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">AOV</button>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Daily</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Weekly</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Monthly</button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center min-h-[250px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-slate-400 font-medium text-sm flex items-center gap-2">
                <BarChart3 className="w-5 h-5"/> Interactive Chart Placeholder
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" /> Revenue by Source
          </h3>
          <div className="space-y-4">
            <SourceBar label="Meta Ads" amount="₹45,000" percent={31.0} color="bg-blue-500" />
            <SourceBar label="Google Ads" amount="₹32,000" percent={22.1} color="bg-emerald-500" />
            <SourceBar label="Organic Search" amount="₹15,500" percent={10.7} color="bg-indigo-500" />
            <SourceBar label="Direct" amount="₹8,000" percent={5.5} color="bg-slate-500" />
            <SourceBar label="YouTube" amount="₹4,000" percent={2.8} color="bg-rose-500" />
            <SourceBar label="Unattributed / Other" amount="₹40,500" percent={27.9} color="bg-slate-300" />
          </div>
        </div>
      </div>

      {/* 4. Business Funnel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 min-w-[700px]">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-500" /> Business Funnel
          </h3>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 outline-none cursor-pointer">
              <option>All Traffic</option>
              <option>Meta</option>
              <option>Google</option>
              <option>Organic</option>
            </select>
            <select className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 outline-none cursor-pointer">
              <option>All Products</option>
              <option>Class 12 Notes</option>
              <option>PYQ Bundle</option>
              <option>eBook</option>
              <option>Course</option>
            </select>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[700px]">
          <FunnelStage name="Visitors" value="10,000" />
          <FunnelArrow drop="8,800" dropPct="88%" />
          <FunnelStage name="Product View" value="1,200" conv="12%" />
          <FunnelArrow drop="840" dropPct="70%" />
          <FunnelStage name="Add to Cart" value="360" conv="30%" />
          <FunnelArrow drop="162" dropPct="45%" />
          <FunnelStage name="Checkout" value="198" conv="55%" />
          <FunnelArrow drop="40" dropPct="20%" />
          <FunnelStage name="Purchase" value="158" conv="79.8%" highlight />
        </div>
      </div>

      {/* 5. Top Products & Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" /> Professional Product Analytics
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-bold">Product</th>
                <th className="pb-3 font-bold text-right">Views</th>
                <th className="pb-3 font-bold text-right">ATC</th>
                <th className="pb-3 font-bold text-right">Checkout</th>
                <th className="pb-3 font-bold text-right">Purchases</th>
                <th className="pb-3 font-bold text-right">Conv.</th>
                <th className="pb-3 font-bold text-right">Revenue</th>
                <th className="pb-3 font-bold text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <ProductTableRow rank={1} name="Class 12 Physics Notes" views="5,200" atc="340" checkout="180" purchases="84" conv="1.61%" revenue="₹32,400" profit="₹18,100" />
              <ProductTableRow rank={2} name="BSEB Topper Bundle" views="3,800" atc="290" checkout="140" purchases="57" conv="1.50%" revenue="₹28,500" profit="₹15,200" />
              <ProductTableRow rank={3} name="Chemistry PYQ 2024" views="4,100" atc="310" checkout="160" purchases="76" conv="1.85%" revenue="₹15,200" profit="₹9,400" />
              <ProductTableRow rank={4} name="Maths Formula Book" views="1,900" atc="180" checkout="98" purchases="42" conv="2.21%" revenue="₹8,900" profit="₹5,100" />
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" /> Customer Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer relative group">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Customers</p>
              <p className="text-2xl font-black text-slate-900">4,289</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer relative group">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                Repeat Rate
              </p>
              <p className="text-2xl font-black text-slate-900">18.4%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer relative group">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                Avg LTV
              </p>
              <p className="text-2xl font-black text-slate-900">₹840</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer relative group">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Refund Rate</p>
              <p className="text-2xl font-black text-rose-600">2.1%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Action Engine (Business Insights) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Business Insights & Action Engine
        </h3>
        <div className="space-y-4">
          <InsightRow 
            type="warning" 
            title="BSEB Physics Notes conversion dropped 24%" 
            fact="Primary issue: Product page → Add-to-cart rate declined (2.8% to 2.1%)."
            recs={["Mobile conversion declined", "Traffic mix changed", "Price changed", "Landing page variant changed"]}
          />
          <InsightRow 
            type="success" 
            title="Organic traffic generated 42% more revenue" 
            fact="Primary driver: SEO keyword 'BSEB 2024 notes' ranking improved."
            recs={["Consider scaling content around similar topics", "Optimize related products for cross-sell"]}
          />
          <InsightRow 
            type="opportunity" 
            title="Product X has high views but unusually low Add-to-Cart rate" 
            fact="Drop-off: 90% visitors bounce within 5 seconds on mobile."
            recs={["Check page load speed on mobile", "Ensure add-to-cart button is visible above fold"]}
          />
        </div>
      </div>
      
        </>
      )}

      {currentTab === "revenue" && <RevenueTab />}

    </div>
  );
}

// Sub-components for Analytics

function Tab({ children, active, href }: { children: React.ReactNode, active?: boolean, href?: string }) {
  const className = cn(
    "px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors",
    active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  );
  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return <button className={className}>{children}</button>;
}

function MetricCard({ title, value, trendPct, trendAbs, trendUp, highlight, definition }: any) {
  return (
    <div className={cn("bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group relative", highlight && "bg-indigo-50 border-indigo-200")}>
      <div className="flex justify-between items-start mb-1.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1" title={title}>{title}</p>
        {definition && (
          <div className="group/tooltip relative">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 pointer-events-none">
              {definition}
            </div>
          </div>
        )}
      </div>
      <h4 className={cn("text-lg font-black text-slate-900 mb-2", highlight && "text-indigo-700")}>{value}</h4>
      {(trendPct || trendAbs) ? (
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-bold",
          trendUp === undefined ? "text-slate-400" : trendUp ? "text-emerald-600" : "text-rose-600"
        )}>
          {trendUp === undefined ? null : trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trendPct}</span>
          {trendAbs && trendAbs !== "₹0" && <span className="text-slate-300 font-normal">|</span>}
          {trendAbs && trendAbs !== "₹0" && <span>{trendAbs}</span>}
        </div>
      ) : (
        <div className="h-3.5"></div>
      )}
    </div>
  )
}

function SourceBar({ label, amount, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-1.5">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-900">{amount} <span className="text-slate-400 font-medium ml-1">({percent}%)</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={cn("h-2 rounded-full", color)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}

function FunnelStage({ name, value, conv, highlight }: any) {
  return (
    <div className="flex flex-col items-center flex-1">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 text-center">{name}</p>
      <p className={cn("text-xl font-black", highlight ? "text-emerald-600" : "text-slate-900")}>{value}</p>
      {conv && <p className="text-[10px] font-bold text-indigo-500 mt-1 bg-indigo-50 px-2 py-0.5 rounded-full">{conv} Conv.</p>}
    </div>
  )
}

function FunnelArrow({ drop, dropPct }: any) {
  return (
    <div className="flex flex-col items-center mt-6 flex-1 min-w-[60px]">
      <div className="w-full h-px bg-slate-200 relative flex items-center justify-center">
        <ArrowRight className="w-4 h-4 text-slate-300 absolute right-[-8px] bg-slate-50" />
      </div>
      <p className="text-[10px] font-bold text-rose-500 mt-2 text-center whitespace-nowrap">Drop-off:<br/>{drop} ({dropPct})</p>
    </div>
  )
}

function ProductTableRow({ rank, name, views, atc, checkout, purchases, conv, revenue, profit }: any) {
  return (
    <tr className="hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
            {rank}
          </div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
        </div>
      </td>
      <td className="py-3 text-right font-medium text-slate-600">{views}</td>
      <td className="py-3 text-right font-medium text-slate-600">{atc}</td>
      <td className="py-3 text-right font-medium text-slate-600">{checkout}</td>
      <td className="py-3 text-right font-medium text-slate-900">{purchases}</td>
      <td className="py-3 text-right font-bold text-indigo-600">{conv}</td>
      <td className="py-3 text-right font-black text-emerald-600">{revenue}</td>
      <td className="py-3 text-right font-bold text-slate-800">{profit}</td>
    </tr>
  )
}

function InsightRow({ type, title, fact, recs }: { type: 'warning' | 'success' | 'opportunity', title: string, fact: string, recs: string[] }) {
  const configs = {
    warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    opportunity: { icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  }
  const config = configs[type];
  const Icon = config.icon;
  
  return (
    <div className={cn("flex flex-col md:flex-row items-start gap-4 p-5 rounded-2xl border", config.bg, config.border)}>
      <Icon className={cn("w-6 h-6 shrink-0", config.color)} />
      <div className="flex-1 space-y-3">
        <h4 className={cn("font-bold text-base", config.color)}>{title}</h4>
        
        <div className="bg-white/60 p-3 rounded-lg border border-white/40">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Fact / Data</p>
          <p className="text-sm font-medium text-slate-800">{fact}</p>
        </div>
        
        <div className="pt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Possible Contributing Factors & Actions</p>
          <ul className="space-y-1.5">
            {recs.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <button className="text-xs font-bold uppercase tracking-wider bg-white hover:bg-slate-50 px-4 py-2 rounded-xl shadow-sm transition-all text-slate-700 border border-slate-200 mt-2 md:mt-0 whitespace-nowrap self-start">
        View Breakdown →
      </button>
    </div>
  )
}
