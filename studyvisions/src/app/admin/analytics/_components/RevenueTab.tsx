import { 
  TrendingUp, TrendingDown, RefreshCcw, CheckCircle2, AlertCircle, 
  BarChart3, PieChart, Activity, Users, ShoppingBag, DollarSign, Filter,
  ArrowRight, Download, Zap, Lightbulb, Info, CreditCard, Banknote, 
  CalendarDays, Globe, Search, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RevenueTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 2. Revenue KPI Command Bar */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Summary
          </h3>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
          <SmallMetric title="Gross Sales" value="₹1,50,000" trend="+21%" />
          <SmallMetric title="Discounts" value="₹12,400" trend="+15%" negative />
          <SmallMetric title="Refunds" value="₹5,000" trend="+5%" negative />
          <SmallMetric title="Net Revenue" value="₹1,32,600" trend="+21.3%" highlight />
          <SmallMetric title="Payment Fees" value="₹2,900" trend="+12%" negative />
          <SmallMetric title="Ad Spend" value="₹30,000" trend="+10%" negative />
          <SmallMetric title="Other Costs" value="₹25,000" trend="0%" />
          <SmallMetric title="Net Profit" value="₹74,700" trend="+28%" highlight />
          <SmallMetric title="Orders" value="142" trend="+12%" />
          <SmallMetric title="AOV" value="₹1,056" trend="+8%" />
        </div>
      </div>

      {/* Targets & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> Revenue Target
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-500">Monthly Goal</span>
                <span className="text-slate-900">₹1,50,000 / ₹2,00,000 <span className="text-emerald-600 ml-1">(75%)</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-emerald-500" style={{ width: `75%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Required Daily</p>
                <p className="text-lg font-black text-slate-900">₹8,333</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Days Left</p>
                <p className="text-lg font-black text-slate-900">6 Days</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Business Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AlertItem type="success" text="Revenue increased 21.3% vs previous period" />
            <AlertItem type="warning" text="Refund rate increased significantly on PYQ Bundle" />
            <AlertItem type="danger" text="Payment failures increased by 15% today" />
            <AlertItem type="opportunity" text="Coupon discounts consuming higher share of sales" />
          </div>
        </div>
      </div>

      {/* 3. Revenue Trend */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue Trend
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Daily</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Weekly</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Monthly</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Yearly</button>
          </div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {/* Mock Chart UI */}
          <div className="absolute bottom-0 w-full h-48 flex items-end justify-between px-8 pb-4 gap-2 opacity-40">
            {[40, 60, 30, 80, 50, 90, 70, 100, 60, 85, 45, 75, 95].map((h, i) => (
              <div key={i} className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 text-center">
              <p className="text-xs font-bold text-slate-500 mb-1">Hover Interaction Example</p>
              <p className="text-sm font-black text-slate-900">24 Sep 2026</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left mt-3">
                <span className="text-xs font-medium text-slate-600">Gross Sales</span><span className="text-xs font-bold text-slate-900 text-right">₹12,500</span>
                <span className="text-xs font-medium text-rose-600">Refunds</span><span className="text-xs font-bold text-rose-600 text-right">₹500</span>
                <span className="text-xs font-medium text-indigo-600 border-t border-slate-200 pt-1">Net Revenue</span><span className="text-xs font-black text-indigo-600 text-right border-t border-slate-200 pt-1">₹12,000</span>
                <span className="text-xs font-medium text-slate-600">Orders</span><span className="text-xs font-bold text-slate-900 text-right">61</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Revenue Breakdown & 6. Order & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" /> Revenue Composition
          </h3>
          <div className="space-y-0 text-sm">
            <BreakdownRow label="Gross Sales" amount="₹1,50,000" strong />
            <BreakdownRow label="− Discounts" amount="₹12,400" negative />
            <BreakdownRow label="− Refunds" amount="₹5,000" negative />
            <div className="my-2 border-t border-slate-200"></div>
            <BreakdownRow label="Net Revenue" amount="₹1,32,600" strong highlight="text-indigo-600" />
            <div className="my-2"></div>
            <BreakdownRow label="− Payment Fees" amount="₹2,900" negative />
            <BreakdownRow label="− Ad Spend" amount="₹30,000" negative />
            <BreakdownRow label="− COGS" amount="₹20,000" negative />
            <BreakdownRow label="− Other Costs" amount="₹5,000" negative />
            <div className="my-2 border-t border-slate-200"></div>
            <BreakdownRow label="Net Profit" amount="₹74,700" strong highlight="text-emerald-600" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Payment Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attempts</p>
                <p className="text-2xl font-black text-slate-900">250</p>
                <div className="flex flex-col gap-1 mt-3 text-xs font-medium text-slate-600">
                  <div className="flex justify-between"><span>Successful</span><span className="font-bold text-emerald-600">198</span></div>
                  <div className="flex justify-between"><span>Failed</span><span className="font-bold text-rose-600">32</span></div>
                  <div className="flex justify-between"><span>Cancelled</span><span className="font-bold text-slate-500">12</span></div>
                  <div className="flex justify-between"><span>Verification Failed</span><span className="font-bold text-amber-500">8</span></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Potential Lost Revenue</p>
                <p className="text-3xl font-black text-rose-600">₹45,200</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Due to failed/cancelled payments</p>
                <button className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                  View Failed Orders <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Product Revenue Analysis */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" /> Product Revenue Table
          </h3>
          <button className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            Customize Columns
          </button>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead>
            <tr className="text-slate-500 border-b border-slate-100">
              <th className="pb-3 font-bold">Product</th>
              <th className="pb-3 font-bold">Category</th>
              <th className="pb-3 font-bold text-right">Orders</th>
              <th className="pb-3 font-bold text-right">Gross Sales</th>
              <th className="pb-3 font-bold text-right text-rose-500">Refunds</th>
              <th className="pb-3 font-bold text-right text-indigo-600">Net Revenue</th>
              <th className="pb-3 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <ProductRevenueRow name="Class 12 Physics Notes" cat="Notes" orders="84" gross="₹35,000" refund="₹500" net="₹34,500" />
            <ProductRevenueRow name="BSEB Topper Bundle" cat="Bundle" orders="57" gross="₹30,000" refund="₹1,000" net="₹29,000" />
            <ProductRevenueRow name="Chemistry PYQ 2024" cat="PYQs" orders="76" gross="₹17,000" refund="₹500" net="₹16,500" />
            <ProductRevenueRow name="Maths Formula Book" cat="eBook" orders="89" gross="₹10,000" refund="₹0" net="₹10,000" />
          </tbody>
        </table>
      </div>

      {/* 8. Revenue Attribution & Landing Page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" /> Source & Campaign Revenue
          </h3>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-bold">Campaign</th>
                <th className="pb-3 font-bold text-right">Spend</th>
                <th className="pb-3 font-bold text-right">Revenue</th>
                <th className="pb-3 font-bold text-right">Orders</th>
                <th className="pb-3 font-bold text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <CampaignRow name="Class 12 Physics (Meta)" spend="₹8,000" rev="₹25,000" orders="120" roas="3.12x" />
              <CampaignRow name="PYQ Campaign (Google)" spend="₹5,000" rev="₹12,000" orders="65" roas="2.40x" />
              <CampaignRow name="Bundle Campaign (Meta)" spend="₹3,000" rev="₹9,000" orders="40" roas="3.00x" />
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-amber-600" /> Discount & Coupon Analytics
          </h3>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-bold">Coupon Code</th>
                <th className="pb-3 font-bold text-right">Uses</th>
                <th className="pb-3 font-bold text-right text-rose-500">Discount Cost</th>
                <th className="pb-3 font-bold text-right text-emerald-600">Revenue Gen.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <CouponRow code="WELCOME10" uses="48" cost="₹4,800" rev="₹25,000" />
              <CouponRow code="EXAM20" uses="22" cost="₹4,400" rev="₹18,000" />
              <CouponRow code="FESTIVAL50" uses="14" cost="₹3,200" rev="₹11,500" />
            </tbody>
          </table>
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-medium text-indigo-800">
            <strong>Insight:</strong> WELCOME10 coupon generates 5.2x ROI based on discount cost vs revenue.
          </div>
        </div>
      </div>

    </div>
  );
}

// Reusable Components

function SmallMetric({ title, value, trend, negative, highlight }: any) {
  return (
    <div className={cn(
      "bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group",
      highlight && "border-indigo-300 bg-indigo-50/50"
    )}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{title}</p>
      <p className={cn("text-base font-black text-slate-900", highlight && "text-indigo-700")}>{value}</p>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold mt-1",
          trend === "0%" ? "text-slate-400" : (negative ? "text-rose-600" : "text-emerald-600")
        )}>{trend}</span>
      )}
    </div>
  )
}

function AlertItem({ type, text }: { type: 'success' | 'warning' | 'danger' | 'opportunity', text: string }) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    opportunity: "bg-blue-500",
  }
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
      <div className={cn("w-2 h-2 rounded-full shrink-0", colors[type])}></div>
      <p>{text}</p>
    </div>
  )
}

function BreakdownRow({ label, amount, negative, strong, highlight }: any) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className={cn("text-slate-600", strong && "font-bold text-slate-800")}>{label}</span>
      <span className={cn("font-medium", negative ? "text-rose-600" : "text-slate-900", strong && "font-black", highlight)}>{amount}</span>
    </div>
  )
}

function ProductRevenueRow({ name, cat, orders, gross, refund, net }: any) {
  return (
    <tr className="hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
      <td className="py-3 font-bold text-slate-800">{name}</td>
      <td className="py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{cat}</span></td>
      <td className="py-3 text-right font-medium text-slate-600">{orders}</td>
      <td className="py-3 text-right font-medium text-slate-600">{gross}</td>
      <td className="py-3 text-right font-medium text-rose-500">{refund}</td>
      <td className="py-3 text-right font-black text-indigo-600">{net}</td>
      <td className="py-3 text-center">
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowUpRight className="w-4 h-4 mx-auto" />
        </button>
      </td>
    </tr>
  )
}

function CampaignRow({ name, spend, rev, orders, roas }: any) {
  return (
    <tr className="hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
      <td className="py-3 font-bold text-slate-800 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div> {name}
      </td>
      <td className="py-3 text-right font-medium text-rose-500">{spend}</td>
      <td className="py-3 text-right font-black text-emerald-600">{rev}</td>
      <td className="py-3 text-right font-medium text-slate-600">{orders}</td>
      <td className="py-3 text-right font-bold text-indigo-600">{roas}</td>
    </tr>
  )
}

function CouponRow({ code, uses, cost, rev }: any) {
  return (
    <tr className="hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
      <td className="py-3 font-bold text-slate-800">
        <span className="border border-dashed border-slate-300 px-2 py-1 rounded bg-slate-50 tracking-wider text-xs">{code}</span>
      </td>
      <td className="py-3 text-right font-medium text-slate-600">{uses}</td>
      <td className="py-3 text-right font-medium text-rose-500">{cost}</td>
      <td className="py-3 text-right font-black text-emerald-600">{rev}</td>
    </tr>
  )
}
