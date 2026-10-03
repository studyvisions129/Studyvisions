import React from "react";
import { 
  TrendingUp, TrendingDown, CheckCircle2, AlertCircle, 
  PieChart, Activity, Users, ShoppingBag, DollarSign, Filter,
  ArrowRight, Download, CreditCard,
  Globe, ArrowUpRight, Target, FileText, ChevronDown,
  LayoutDashboard, Megaphone, Tag, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RevenueTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 mr-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-slate-700">Filters:</span>
        </div>
        <FilterSelect label="Product" options={["All Products", "Class 12 Notes", "BSEB Bundle", "Maths Formula"]} />
        <FilterSelect label="Category" options={["All Categories", "Notes", "eBooks", "Courses", "Bundles"]} />
        <FilterSelect label="Source" options={["All Sources", "Meta Ads", "Google Ads", "Organic", "Direct"]} />
        <FilterSelect label="Payment" options={["All Methods", "UPI", "Cards", "Net Banking"]} />
        <FilterSelect label="Customer" options={["All Customers", "First-time", "Returning"]} />
        <button className="text-xs font-bold text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-4 ml-auto">
          Clear Filters
        </button>
      </div>

      {/* LEVEL 1 — FINANCIAL SUMMARY (KPI Command Bar) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500 bg-emerald-50 p-1 rounded-md" /> 
            Level 1 — Financial Summary
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KPICard title="Gross Sales" value="₹1,50,000" trend="+21.3%" amount="+₹25,476" up />
          <KPICard title="Discounts" value="₹12,400" trend="+15.0%" amount="+₹1,617" down alert />
          <KPICard title="Refunds" value="₹5,000" trend="+5.0%" amount="+₹238" down />
          <KPICard title="Net Revenue" value="₹1,32,600" trend="+22.1%" amount="+₹23,980" up highlight="emerald" />
          <KPICard title="Orders" value="142" trend="+12.2%" amount="+15" up />
          
          <KPICard title="AOV" value="₹933" trend="+3.0%" amount="+₹27" up />
          <KPICard title="Payment Fees" value="₹2,900" trend="+12.1%" amount="+₹312" down />
          <KPICard title="Ad Spend" value="₹30,000" trend="+10.0%" amount="+₹2,727" down />
          <KPICard title="Net Profit" value="₹74,700" trend="+28.5%" amount="+₹16,580" up highlight="indigo" />
          <KPICard title="Profit Margin" value="56.3%" trend="+3.2%" amount="+3.2%" up highlight="purple" />
        </div>
      </div>

      {/* LEVEL 2 — REVENUE TREND */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500 bg-indigo-50 p-1 rounded-md" /> 
            Level 2 — Revenue Trend
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800 transition-all">Revenue</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Orders</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Profit</button>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800 transition-all">Daily</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Weekly</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Monthly</button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-[250px] flex items-end justify-between px-6 pb-6 gap-2 opacity-60">
            {[30, 45, 25, 60, 40, 80, 55, 95, 65, 85, 50, 75, 100, 70, 90].map((h, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md relative hover:bg-indigo-600 transition-colors cursor-crosshair group/bar" style={{ height: `${h}%` }}>
                {i === 12 && (
                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-xl border border-slate-200 text-left min-w-[150px] z-10 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-2">24 Sep 2026</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs"><span className="font-medium text-slate-500">Gross Sales</span><span className="font-bold text-slate-800">₹12,500</span></div>
                      <div className="flex justify-between text-xs"><span className="font-medium text-slate-500">Refunds</span><span className="font-bold text-rose-500">₹500</span></div>
                      <div className="flex justify-between text-xs pt-1 border-t border-slate-100"><span className="font-bold text-indigo-600">Net Revenue</span><span className="font-black text-indigo-700">₹12,000</span></div>
                      <div className="flex justify-between text-xs pt-1"><span className="font-medium text-slate-500">Orders</span><span className="font-bold text-slate-800">61</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-3">
             <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Current Period</span>
             <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><span className="w-2 h-2 rounded-full border-2 border-slate-300"></span> Previous Period</span>
          </div>
        </div>
      </div>

      {/* LEVEL 3 & 4 — BREAKDOWN & SOURCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEVEL 3 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500 bg-emerald-50 p-1 rounded-md" /> 
            Level 3 — Revenue Breakdown
          </h3>
          <div className="space-y-1 relative">
            <div className="absolute left-[15px] top-[30px] bottom-[30px] w-px bg-slate-200 z-0"></div>
            <BreakdownStep label="Gross Sales" amount="₹1,50,000" type="start" />
            <BreakdownStep label="Discounts" amount="−₹12,400" type="minus" />
            <BreakdownStep label="Refunds" amount="−₹5,000" type="minus" />
            <BreakdownStep label="Net Revenue" amount="₹1,32,600" type="result" highlight="text-indigo-600 bg-indigo-50" />
            <BreakdownStep label="Payment Fees" amount="−₹2,900" type="minus" />
            <BreakdownStep label="Ad Spend" amount="−₹30,000" type="minus" />
            <BreakdownStep label="COGS" amount="−₹20,000" type="minus" />
            <BreakdownStep label="Other Costs" amount="−₹5,000" type="minus" />
            <BreakdownStep label="Net Profit" amount="₹74,700" type="result" highlight="text-emerald-600 bg-emerald-50" />
          </div>
        </div>

        {/* LEVEL 4 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500 bg-purple-50 p-1 rounded-md" /> 
            Level 4 — Revenue by Source
          </h3>
          <div className="flex-1 space-y-5">
            <SourceProgress label="Meta Ads" rev="₹45,000" pct="45%" roas="2.5x" color="bg-blue-500" />
            <SourceProgress label="Google Ads" rev="₹32,000" pct="32%" roas="3.1x" color="bg-emerald-500" />
            <SourceProgress label="Organic Search" rev="₹15,500" pct="15%" roas="∞" color="bg-indigo-500" />
            <SourceProgress label="Direct" rev="₹8,000" pct="8%" roas="∞" color="bg-slate-500" />
            <SourceProgress label="YouTube" rev="₹4,000" pct="4%" roas="∞" color="bg-rose-500" />
          </div>
        </div>
      </div>

      {/* LEVEL 5 — PRODUCT REVENUE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500 bg-amber-50 p-1 rounded-md" /> 
            Level 5 — Product Revenue
          </h3>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
             Full Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pl-2">Product</th>
                <th className="pb-3 text-right">Orders</th>
                <th className="pb-3 text-right">Gross Sales</th>
                <th className="pb-3 text-right">Refunds</th>
                <th className="pb-3 text-right">Net Revenue</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <ProductTableItem name="Class 12 Physics Notes" orders="84" gross="₹35,000" ref="₹500" net="₹34,500" />
              <ProductTableItem name="BSEB Topper Bundle" orders="57" gross="₹30,000" ref="₹1,000" net="₹29,000" />
              <ProductTableItem name="Chemistry PYQ" orders="76" gross="₹17,000" ref="₹500" net="₹16,500" />
              <ProductTableItem name="Maths Formula Book" orders="89" gross="₹10,000" ref="₹0" net="₹10,000" />
            </tbody>
          </table>
        </div>
      </div>

      {/* LEVEL 6 — CAMPAIGN & LANDING PAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-rose-500 bg-rose-50 p-1 rounded-md" /> 
            Level 6 — Campaigns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2">Campaign</th>
                  <th className="pb-2 text-right">Spend</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <CampaignTableItem name="Class 12 Physics" spend="₹8,000" rev="₹25,000" roas="3.12x" />
                <CampaignTableItem name="PYQ Campaign" spend="₹5,000" rev="₹12,000" roas="2.40x" />
                <CampaignTableItem name="Bundle Campaign" spend="₹3,000" rev="₹9,000" roas="3.00x" />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-500 bg-blue-50 p-1 rounded-md" /> 
            Level 6 — Landing Pages
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2">Page</th>
                  <th className="pb-2 text-right">Visitors</th>
                  <th className="pb-2 text-right">Conv.</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <LandingPageTableItem name="Physics Notes LP" vis="10,000" conv="1.58%" rev="₹31,600" />
                <LandingPageTableItem name="Main Homepage" vis="4,500" conv="0.8%" rev="₹18,500" />
                <LandingPageTableItem name="Bundle Offer LP" vis="2,100" conv="2.4%" rev="₹22,000" />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LEVEL 7 & 8 — CUSTOMERS & PAYMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEVEL 7 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500 bg-teal-50 p-1 rounded-md" /> 
            Level 7 — Customer Revenue
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group hover:border-slate-300 transition-all cursor-pointer">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">First-time</p>
              <p className="text-2xl font-black text-slate-900 mb-1 relative z-10">₹90,000</p>
              <p className="text-xs font-bold text-emerald-600 relative z-10">+12% vs prev</p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-20 h-20" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group hover:border-slate-300 transition-all cursor-pointer">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Returning</p>
              <p className="text-2xl font-black text-slate-900 mb-1 relative z-10">₹55,000</p>
              <p className="text-xs font-bold text-emerald-600 relative z-10">+24% vs prev</p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-20 h-20" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center p-4 bg-teal-50/50 border border-teal-100 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Repeat Purchase Rate</p>
              <p className="text-xl font-black text-teal-900 mt-1">18.4%</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Avg LTV</p>
              <p className="text-xl font-black text-teal-900 mt-1">₹840</p>
            </div>
          </div>
        </div>

        {/* LEVEL 8 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-500 bg-sky-50 p-1 rounded-md" /> 
            Level 8 — Payments & Refunds
          </h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Success Rate</p>
                <div className="flex items-end gap-2"><p className="text-2xl font-black text-slate-900">79.2%</p><span className="text-xs font-bold text-rose-500 mb-1.5">-2.1%</span></div>
              </div>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between"><span>Attempts</span><span className="text-slate-900">250</span></div>
                <div className="flex justify-between"><span>Successful</span><span className="text-emerald-600">198</span></div>
                <div className="flex justify-between"><span>Failed</span><span className="text-rose-500">32</span></div>
                <div className="flex justify-between"><span>Cancelled</span><span className="text-slate-500">12</span></div>
                <div className="flex justify-between"><span>Verification Fail</span><span className="text-amber-500">8</span></div>
              </div>
            </div>
            <div className="hidden sm:block w-px bg-slate-200"></div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Refund Rate</p>
                <div className="flex items-end gap-2"><p className="text-2xl font-black text-rose-600">3.4%</p></div>
              </div>
              <div className="space-y-2 text-xs font-bold text-slate-600 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Potential Lost Rev</p>
                <p className="text-xl font-black text-slate-800">₹45,200</p>
                <button className="text-indigo-600 hover:underline mt-2 inline-flex items-center gap-1 transition-all">View Failed Orders <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 9 & 10 — COUPONS & TARGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEVEL 9 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-pink-500 bg-pink-50 p-1 rounded-md" /> 
            Level 9 — Coupons & Discounts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2">Coupon</th>
                  <th className="pb-2 text-right">Uses</th>
                  <th className="pb-2 text-right">Discount</th>
                  <th className="pb-2 text-right">Revenue Gen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <CouponTableItem code="WELCOME10" uses="48" disc="₹4,800" rev="₹25,000" />
                <CouponTableItem code="EXAM20" uses="22" disc="₹4,400" rev="₹18,000" />
                <CouponTableItem code="FESTIVAL" uses="14" disc="₹3,200" rev="₹11,500" />
              </tbody>
            </table>
          </div>
        </div>

        {/* LEVEL 10 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500 bg-orange-50 p-1 rounded-md" /> 
            Level 10 — Targets & Alerts
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Target Pace</p>
                  <p className="text-lg font-black text-slate-900">₹1,50,000 <span className="text-sm font-bold text-slate-400">/ ₹2,00,000</span></p>
                </div>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">75% Achieved</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
                <span>Required Daily: ₹8,333</span>
                <span>Remaining: 6 Days</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <p className="text-xs font-bold text-rose-900">Payment failures increased by 15% today.</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-xs font-bold text-emerald-900">Revenue increased significantly vs previous period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 11 — REPORTS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-indigo-200 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <FileText className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Level 11 — Export & Reports</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Generate comprehensive financial reports for accounting and audits.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-slate-300 transition-colors flex-1 sm:flex-none">
            <option>Revenue Summary</option>
            <option>Sales Report</option>
            <option>Product Revenue</option>
            <option>Refund Report</option>
            <option>Tax Reporting</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Download className="w-4 h-4" /> Generate CSV
          </button>
        </div>
      </div>

    </div>
  );
}

/* --- Sub Components --- */

function FilterSelect({ label, options }: any) {
  return (
    <div className="relative group">
      <select className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl pl-3 pr-8 py-2 outline-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm">
        {options.map((opt: string) => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-slate-600 transition-colors" />
    </div>
  )
}

function KPICard({ title, value, trend, amount, up, down, alert, highlight }: any) {
  return (
    <div className={cn(
      "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
      highlight === "emerald" && "border-emerald-200 bg-emerald-50/30",
      highlight === "indigo" && "border-indigo-200 bg-indigo-50/30",
      highlight === "purple" && "border-purple-200 bg-purple-50/30",
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
          </div>
        </div>
        <div>
          <h4 className={cn("text-xl font-black mb-1.5", 
            highlight === "emerald" ? "text-emerald-700" : 
            highlight === "indigo" ? "text-indigo-700" : 
            highlight === "purple" ? "text-purple-700" : "text-slate-900"
          )}>{value}</h4>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {up && <TrendingUp className="w-3 h-3 text-emerald-500" />}
            {down && <TrendingDown className={cn("w-3 h-3", alert ? "text-rose-500" : "text-emerald-500")} />}
            <span className={cn(up ? "text-emerald-600" : down ? (alert ? "text-rose-600" : "text-emerald-600") : "text-slate-500")}>{trend}</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="text-slate-500">{amount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BreakdownStep({ label, amount, type, highlight }: any) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-white transition-colors group-hover:border-indigo-300",
        type === "start" ? "border-slate-300 text-slate-400" :
        type === "minus" ? "border-rose-200 text-rose-400" :
        "border-indigo-300 text-indigo-500"
      )}>
        {type === "start" ? <div className="w-2 h-2 rounded-full bg-slate-300"></div> :
         type === "minus" ? <span className="text-lg font-bold leading-none -mt-0.5">-</span> :
         <span className="text-lg font-bold leading-none -mt-0.5">=</span>}
      </div>
      <div className={cn("flex-1 flex justify-between items-center py-3 px-4 rounded-xl cursor-pointer group", highlight ? highlight : "hover:bg-slate-50 transition-colors")}>
        <span className={cn("font-bold transition-colors", type === "result" ? "text-slate-900 text-sm" : "text-slate-600 text-sm", highlight && "text-indigo-900")}>{label}</span>
        <span className={cn("font-black transition-colors", type === "result" ? "text-lg" : "text-sm text-slate-700", type === "minus" && "text-rose-600", highlight && "text-indigo-700")}>{amount}</span>
      </div>
    </div>
  )
}

function SourceProgress({ label, rev, pct, roas, color }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
          <div className={cn("w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125", color)}></div> {label}
        </span>
        <div className="text-right">
          <span className="text-sm font-black text-slate-900">{rev}</span>
          <span className="text-xs font-bold text-slate-400 ml-2">{pct}</span>
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
        <div className={cn("h-2 rounded-full transition-all duration-1000", color)} style={{ width: pct }}></div>
      </div>
      <p className="text-[10px] font-bold text-slate-500 text-right">ROAS: <span className="text-slate-700 group-hover:text-indigo-600 transition-colors">{roas}</span></p>
    </div>
  )
}

function ProductTableItem({ name, orders, gross, ref, net }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="py-3 pl-2 font-bold text-slate-800 text-xs group-hover:text-indigo-700 transition-colors">{name}</td>
      <td className="py-3 text-right font-medium text-slate-600">{orders}</td>
      <td className="py-3 text-right font-medium text-slate-600">{gross}</td>
      <td className="py-3 text-right font-medium text-rose-500">{ref}</td>
      <td className="py-3 text-right font-black text-indigo-600">{net}</td>
      <td className="py-3 text-right pr-2">
        <button className="text-slate-400 group-hover:text-indigo-600 transition-colors p-1 hover:bg-indigo-50 rounded">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  )
}

function CampaignTableItem({ name, spend, rev, roas }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="py-2.5 font-bold text-slate-800 text-xs group-hover:text-indigo-700 transition-colors">{name}</td>
      <td className="py-2.5 text-right font-medium text-slate-600">{spend}</td>
      <td className="py-2.5 text-right font-black text-emerald-600">{rev}</td>
      <td className="py-2.5 text-right font-bold text-indigo-600">{roas}</td>
    </tr>
  )
}

function LandingPageTableItem({ name, vis, conv, rev }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="py-2.5 font-bold text-slate-800 text-xs group-hover:text-indigo-700 transition-colors">{name}</td>
      <td className="py-2.5 text-right font-medium text-slate-600">{vis}</td>
      <td className="py-2.5 text-right font-bold text-indigo-600">{conv}</td>
      <td className="py-2.5 text-right font-black text-emerald-600">{rev}</td>
    </tr>
  )
}

function CouponTableItem({ code, uses, disc, rev }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="py-2.5 font-bold text-slate-800 text-xs">
        <span className="border border-dashed border-slate-300 px-1.5 py-0.5 rounded bg-white tracking-wider group-hover:border-indigo-300 group-hover:text-indigo-700 transition-colors">{code}</span>
      </td>
      <td className="py-2.5 text-right font-medium text-slate-600">{uses}</td>
      <td className="py-2.5 text-right font-medium text-rose-500">{disc}</td>
      <td className="py-2.5 text-right font-black text-emerald-600">{rev}</td>
    </tr>
  )
}
