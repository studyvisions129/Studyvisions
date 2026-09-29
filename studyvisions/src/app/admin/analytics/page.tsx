import GlobalDateFilter from "../_components/GlobalDateFilter";
import { 
  TrendingUp, TrendingDown, RefreshCcw, CheckCircle2, AlertCircle, 
  BarChart3, PieChart, Activity, Users, ShoppingBag, DollarSign, Filter,
  ArrowRight, Download, Zap, Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto">
      
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
        <Tab active>Overview</Tab>
        <Tab>Revenue</Tab>
        <Tab>Products</Tab>
        <Tab>Customers</Tab>
        <Tab>Marketing</Tab>
        <Tab>Funnel</Tab>
        <Tab>Profit</Tab>
        <Tab>Attribution</Tab>
        <Tab>Reports</Tab>
      </div>

      {/* 2. Command Center Metrics (Levels 1-4) */}
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
            <MetricCard title="Net Profit" value="₹87,100" trendPct="+28.5%" trendAbs="+₹19,331" trendUp={true} highlight />
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
            <MetricCard title="Repeat Purchase" value="18.4%" trendPct="+1.2%" trendAbs="+1.2%" trendUp={true} />
            <MetricCard title="Customer LTV" value="₹3,450" trendPct="+4.5%" trendAbs="+₹148" trendUp={true} highlight />
            <MetricCard title="CAC" value="₹254" trendPct="-5.2%" trendAbs="-₹14" trendUp={true} highlight />
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
            <MetricCard title="CAC" value="₹254" trendPct="-5.2%" trendAbs="-₹14" trendUp={true} />
            <MetricCard title="Organic Revenue" value="₹15,500" trendPct="+42.0%" trendAbs="+₹4,583" trendUp={true} />
            <MetricCard title="Paid Revenue" value="₹1,29,500" trendPct="+18.4%" trendAbs="+₹20,127" trendUp={true} />
            <MetricCard title="Email Revenue" value="₹0" trendPct="0%" trendAbs="₹0" />
          </div>
        </div>
      </div>

      {/* 3. Revenue Trend & Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue Trend
            </h3>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Daily</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Weekly</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Monthly</button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center min-h-[250px]">
            <span className="text-slate-400 font-medium text-sm flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Interactive Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" /> Revenue by Source
          </h3>
          <div className="space-y-4">
            <SourceBar label="Meta Ads" amount="₹45,000" percent={45} color="bg-blue-500" />
            <SourceBar label="Google Ads" amount="₹32,000" percent={32} color="bg-emerald-500" />
            <SourceBar label="Organic Search" amount="₹15,500" percent={15} color="bg-indigo-500" />
            <SourceBar label="Direct" amount="₹8,000" percent={8} color="bg-slate-500" />
            <SourceBar label="YouTube" amount="₹4,000" percent={4} color="bg-rose-500" />
          </div>
        </div>
      </div>

      {/* 4. Business Funnel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-500" /> Business Funnel
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <FunnelStage name="Visitors" value="10,000" />
          <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
          <FunnelStage name="Product View" value="1,200" drop="12%" />
          <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
          <FunnelStage name="Add to Cart" value="360" drop="30%" />
          <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
          <FunnelStage name="Checkout" value="198" drop="55%" />
          <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
          <FunnelStage name="Purchase" value="158" drop="80%" highlight />
        </div>
      </div>

      {/* 5. Top Products & Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" /> Top Products
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            <ProductRow rank={1} name="Class 12 Physics Notes" revenue="₹32,400" orders={84} />
            <ProductRow rank={2} name="BSEB Topper Bundle" revenue="₹28,500" orders={57} />
            <ProductRow rank={3} name="Chemistry PYQ 2024" revenue="₹15,200" orders={76} />
            <ProductRow rank={4} name="Maths Formula Book" revenue="₹8,900" orders={89} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" /> Customer Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Customers</p>
              <p className="text-2xl font-black text-slate-900">4,289</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Repeat Rate</p>
              <p className="text-2xl font-black text-slate-900">18.4%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg LTV</p>
              <p className="text-2xl font-black text-slate-900">₹840</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
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
        <div className="space-y-3">
          <InsightRow 
            type="warning" 
            title="BSEB Physics Notes conversion dropped 24%" 
            desc="Compared to previous period. Check product page or pricing."
          />
          <InsightRow 
            type="success" 
            title="Organic traffic generated 42% more revenue" 
            desc="SEO efforts are paying off. Consider scaling content."
          />
          <InsightRow 
            type="opportunity" 
            title="Product X has high views but unusually low Add-to-Cart rate" 
            desc="Optimize product description or offer a limited-time discount."
          />
        </div>
      </div>

    </div>
  );
}

// Sub-components for Analytics

function Tab({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors",
      active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    )}>
      {children}
    </button>
  )
}

function MetricCard({ title, value, trendPct, trendAbs, trendUp, highlight }: any) {
  return (
    <div className={cn("bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group", highlight && "bg-indigo-50 border-indigo-200")}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 line-clamp-1" title={title}>{title}</p>
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

function FunnelStage({ name, value, drop, highlight }: any) {
  return (
    <div className="flex flex-col items-center flex-1">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 text-center">{name}</p>
      <p className={cn("text-xl font-black", highlight ? "text-emerald-600" : "text-slate-900")}>{value}</p>
      {drop && <p className="text-[10px] font-bold text-indigo-500 mt-1 bg-indigo-50 px-2 py-0.5 rounded-full">{drop} Conv.</p>}
    </div>
  )
}

function ProductRow({ rank, name, revenue, orders }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
          {rank}
        </div>
        <p className="font-bold text-slate-800 text-sm">{name}</p>
      </div>
      <div className="text-right">
        <p className="font-black text-emerald-600 text-sm">{revenue}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{orders} orders</p>
      </div>
    </div>
  )
}

function InsightRow({ type, title, desc }: { type: 'warning' | 'success' | 'opportunity', title: string, desc: string }) {
  const configs = {
    warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    opportunity: { icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  }
  const config = configs[type];
  const Icon = config.icon;
  
  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-2xl border", config.bg, config.border)}>
      <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.color)} />
      <div className="flex-1">
        <h4 className={cn("font-bold text-sm mb-1", config.color)}>{title}</h4>
        <p className="text-sm text-slate-600 font-medium">{desc}</p>
      </div>
      <button className="text-xs font-bold uppercase tracking-wider bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg shadow-sm transition-colors text-slate-700 border border-slate-200/50">
        View Details →
      </button>
    </div>
  )
}
