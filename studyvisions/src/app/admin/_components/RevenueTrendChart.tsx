"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartDataPoint {
  label: string;
  timestamp: string;
  revenue: number;
  orders: number;
  profit: number;
}

interface RevenueTrendChartProps {
  data: ChartDataPoint[];
  currentInterval?: string;
  onIntervalChange?: (interval: string) => void;
}

export default function RevenueTrendChart({ 
  data, 
  currentInterval = "Daily",
  onIntervalChange 
}: RevenueTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "orders" | "profit">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getMetricValue = (point: ChartDataPoint) => {
    switch (selectedMetric) {
      case "revenue":
        return point.revenue;
      case "orders":
        return point.orders;
      case "profit":
        return point.profit;
    }
  };

  const maxValue = Math.max(...data.map(getMetricValue), 1);
  const totalMetricSum = data.reduce((acc, p) => acc + getMetricValue(p), 0);

  const formatValue = (val: number) => {
    if (selectedMetric === "orders") {
      return val.toString();
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      {/* Top Controls: Title, Metric Switcher, Interval Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Revenue Trend</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Total: {formatValue(totalMetricSum)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Authoritative sales timeline for the selected date range</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedMetric("revenue")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                selectedMetric === "revenue"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedMetric("orders")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                selectedMetric === "orders"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Orders
            </button>
            <button
              onClick={() => setSelectedMetric("profit")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                selectedMetric === "profit"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Profit
            </button>
          </div>

          {/* Timeframe Interval Selector */}
          <select 
            value={currentInterval}
            onChange={(e) => onIntervalChange?.(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Chart Canvas */}
      {data.length === 0 || totalMetricSum === 0 ? (
        <div className="h-64 w-full bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No transactions recorded for this period</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            When customer orders are placed and verified through Razorpay, real daily aggregated metrics will appear here.
          </p>
        </div>
      ) : (
        <div className="relative h-64 w-full bg-gradient-to-b from-slate-50/50 to-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-end">
          {/* Subtle Y-Axis Grid Lines */}
          <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-slate-200 w-full flex justify-end text-[10px] text-slate-400 pr-1">
              {formatValue(maxValue)}
            </div>
            <div className="border-b border-slate-200 w-full flex justify-end text-[10px] text-slate-400 pr-1">
              {formatValue(Math.round(maxValue / 2))}
            </div>
            <div className="border-b border-slate-200 w-full flex justify-end text-[10px] text-slate-400 pr-1">
              {formatValue(0)}
            </div>
          </div>

          {/* Bar Columns Container */}
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 z-10 w-full px-2">
            {data.map((point, idx) => {
              const val = getMetricValue(point);
              const heightPercent = Math.max(val > 0 ? (val / maxValue) * 100 : 4, 3);
              const isHovered = hoveredIndex === idx;

              return (
                <div 
                  key={point.label}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2.5 rounded-xl shadow-2xl z-30 min-w-[140px] text-left border border-slate-800 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                      <p className="text-[11px] font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">
                        {point.label}
                      </p>
                      <div className="space-y-0.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Revenue:</span>
                          <span className="font-bold text-emerald-400">₹{point.revenue.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Orders:</span>
                          <span className="font-bold text-indigo-300">{point.orders}</span>
                        </div>
                        <div className="flex justify-between pt-0.5 border-t border-slate-800/80">
                          <span className="text-slate-400">Net Profit:</span>
                          <span className="font-bold text-white">₹{point.profit.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Bar with Gradient */}
                  <div 
                    className={cn(
                      "w-full rounded-t-md transition-all duration-300",
                      selectedMetric === "revenue" && (isHovered ? "bg-emerald-500 shadow-lg shadow-emerald-200" : "bg-gradient-to-t from-emerald-500 to-teal-400 opacity-90"),
                      selectedMetric === "orders" && (isHovered ? "bg-indigo-600 shadow-lg shadow-indigo-200" : "bg-gradient-to-t from-indigo-500 to-indigo-400 opacity-90"),
                      selectedMetric === "profit" && (isHovered ? "bg-violet-600 shadow-lg shadow-violet-200" : "bg-gradient-to-t from-violet-500 to-purple-400 opacity-90"),
                      val === 0 && "bg-slate-200/80 opacity-50"
                    )} 
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* X-Axis Date/Label */}
                  <span className="text-[9px] font-bold text-slate-400 mt-2 truncate max-w-[40px] block">
                    {point.label.length > 5 ? point.label.slice(5) : point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
