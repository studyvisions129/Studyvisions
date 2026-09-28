"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, TrendingUp, Users, ShoppingCart, MousePointerClick, Banknote, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  "Overview", "Content", "Landing Page", "Pricing", "Offers", "Orders", 
  "Customers", "Ads", "Analytics", "Funnel", "Reviews", "SEO", "Files", "Automation"
];

const METRICS = [
  { label: "Revenue", value: "₹45,230", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Units Sold", value: "302", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Visitors", value: "12.4k", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Product Views", value: "8.9k", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "CTA Clicks", value: "2,410", icon: MousePointerClick, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Conversion Rate", value: "2.4%", icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
];

export default function Product360Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">BSEB Premium Notes</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">Product ID: {params.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            Preview Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full overflow-x-auto pb-1 mb-6 custom-scrollbar border-b border-slate-200">
        <div className="flex items-center gap-1 min-w-max px-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2",
                activeTab === tab 
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Row (Always visible for context) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {METRICS.map(metric => (
          <div key={metric.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
              <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", metric.bg)}>
                <metric.icon className={cn("w-3.5 h-3.5", metric.color)} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{metric.value}</h3>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[400px] p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeTab} View</h2>
          <p className="text-slate-500 mb-6">
            This is a placeholder for the {activeTab} module as specified in the Product 360 architecture. 
            Individual components will be connected to the database incrementally.
          </p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700">
            Configure {activeTab}
          </button>
        </div>
      </div>
    </div>
  );
}
