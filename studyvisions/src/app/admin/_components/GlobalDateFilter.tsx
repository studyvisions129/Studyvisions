"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, ChevronDown, Check, Download, Loader2 } from "lucide-react";

const DATE_RANGES = [
  "Today", "Yesterday", "Last 7 Days", "This Week", "Last Week", 
  "This Month", "Last Month", "This Quarter", "Last Quarter", "This Year", 
  "Last Year", "All Time", "Custom Range"
];

const COMPARE_OPTIONS = [
  "Previous Period", "Previous Week", "Previous Month", "Previous Year"
];

export default function GlobalDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "This Month";
  const currentCompare = searchParams.get("compare") || "Previous Period";
  const currentFrom = searchParams.get("from") || "";
  const currentTo = searchParams.get("to") || "";

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(currentRange);
  const [selectedCompare, setSelectedCompare] = useState(currentCompare);
  const [isCompareActive, setIsCompareActive] = useState(true);

  const [customFrom, setCustomFrom] = useState(currentFrom || "2026-10-01");
  const [customTo, setCustomTo] = useState(currentTo || "2026-10-31");
  const [showCustomRange, setShowCustomRange] = useState(currentRange === "Custom Range");
  const [isExporting, setIsExporting] = useState(false);

  const updateFilters = (newRange: string, newCompare?: string, fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", newRange);
    if (newCompare !== undefined) {
      params.set("compare", newCompare);
    }
    if (newRange === "Custom Range" && fromDate && toDate) {
      params.set("from", fromDate);
      params.set("to", toDate);
    } else if (newRange !== "Custom Range") {
      params.delete("from");
      params.delete("to");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = async (type: string, format: string) => {
    setIsExportOpen(false);

    if (format === ".pdf") {
      window.print();
      return;
    }

    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      params.set("type", type);
      params.set("range", selectedDate);
      if (selectedDate === "Custom Range" && customFrom && customTo) {
        params.set("from", customFrom);
        params.set("to", customTo);
      }

      const res = await fetch(`/api/admin/export?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to export report");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studyvisions-${type}-${selectedDate.toLowerCase().replace(/ /g, "-")}${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || "Failed to download export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 relative z-50">
      <div className="flex flex-wrap sm:flex-nowrap items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm relative z-40">
        
        {/* DATE SELECTOR BUTTON */}
        <div className="relative">
          <button 
            onClick={() => { setIsDateOpen(!isDateOpen); setIsCompareOpen(false); setIsExportOpen(false); }}
            className={`px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-lg transition-all ${isDateOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{selectedDate}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          
          {/* DATE DROPDOWN MENU */}
          {isDateOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="max-h-64 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                {DATE_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDate(range);
                      if (range === "Custom Range") {
                        setShowCustomRange(true);
                      } else {
                        setShowCustomRange(false);
                        setIsDateOpen(false);
                        updateFilters(range, selectedCompare);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${selectedDate === range ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {range}
                    {selectedDate === range && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>

              {/* Custom Range Sub-UI */}
              {showCustomRange && (
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">From</label>
                      <input 
                        type="date" 
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 text-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">To</label>
                      <input 
                        type="date" 
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 text-slate-700" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setIsDateOpen(false);
                        updateFilters("Custom Range", selectedCompare, customFrom, customTo);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2 rounded-lg transition-colors mt-2"
                    >
                      Apply Range
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1"></div>

        {/* COMPARE SELECTOR BUTTON */}
        <div className="relative">
          <button 
            onClick={() => { setIsCompareOpen(!isCompareOpen); setIsDateOpen(false); setIsExportOpen(false); }}
            className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-lg transition-all ${isCompareOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            {isCompareActive ? <span className="text-slate-800">vs {selectedCompare}</span> : "Compare"}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* COMPARE DROPDOWN MENU */}
          {isCompareOpen && (
            <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2 px-3 py-1 border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Comparison</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isCompareActive} onChange={() => setIsCompareActive(!isCompareActive)} />
                  <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className={`space-y-1 ${!isCompareActive ? 'opacity-50 pointer-events-none' : ''}`}>
                {COMPARE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedCompare(option);
                      setIsCompareOpen(false);
                      updateFilters(selectedDate, option, customFrom, customTo);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${selectedCompare === option ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {option}
                    {selectedCompare === option && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXPORT BUTTON */}
      <div className="relative z-40">
        <button 
          onClick={() => { setIsExportOpen(!isExportOpen); setIsDateOpen(false); setIsCompareOpen(false); }}
          disabled={isExporting}
          className={`p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl transition-colors group ${isExportOpen ? 'bg-slate-50 border-indigo-300 ring-4 ring-indigo-50 text-indigo-600' : 'hover:bg-slate-50 hover:border-slate-300 text-slate-600'}`}
          title="Export Dashboard Reports"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> : <Download className={`w-5 h-5 transition-colors ${isExportOpen ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`} />}
        </button>

        {isExportOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-1.5 border-b border-slate-100 pb-2 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Export Real Data</span>
            </div>
            <div className="space-y-0.5">
              {[
                { label: "Financial Summary", type: "revenue", ext: ".csv" },
                { label: "Orders Report", type: "orders", ext: ".csv" },
                { label: "Product Performance", type: "products", ext: ".csv" },
                { label: "Customers Report", type: "customers", ext: ".csv" },
                { label: "Print Dashboard", type: "print", ext: ".pdf" }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleExport(option.type, option.ext)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group/item"
                >
                  <span>{option.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover/item:text-indigo-400">{option.ext}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile closing */}
      {(isDateOpen || isCompareOpen || isExportOpen) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => { setIsDateOpen(false); setIsCompareOpen(false); setIsExportOpen(false); }}
        />
      )}
    </div>
  );
}
