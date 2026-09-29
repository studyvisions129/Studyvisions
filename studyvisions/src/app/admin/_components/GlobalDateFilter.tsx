"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Check, Download } from "lucide-react";

const DATE_RANGES = [
  "Today", "Yesterday", "Last 7 Days", "This Week", "Last Week", 
  "This Month", "Last Month", "This Quarter", "This Year", 
  "Last Year", "All Time", "Custom Range"
];

const COMPARE_OPTIONS = [
  "Previous Period", "Previous Week", "Previous Month", 
  "Previous Year", "Custom Period"
];

export default function GlobalDateFilter() {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState("This Month");
  const [selectedCompare, setSelectedCompare] = useState("Previous Period");
  const [isCompareActive, setIsCompareActive] = useState(true);

  const [isExportOpen, setIsExportOpen] = useState(false);

  // Mock states for Custom Range to show the UI
  const [showCustomRange, setShowCustomRange] = useState(false);

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
                      <input type="date" defaultValue="2026-09-01" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 text-slate-700" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">To</label>
                      <input type="date" defaultValue="2026-09-28" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 text-slate-700" />
                    </div>
                    <button 
                      onClick={() => setIsDateOpen(false)}
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
                    onClick={() => { setSelectedCompare(option); setIsCompareOpen(false); }}
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
          className={`p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl transition-colors group ${isExportOpen ? 'bg-slate-50 border-indigo-300 ring-4 ring-indigo-50 text-indigo-600' : 'hover:bg-slate-50 hover:border-slate-300 text-slate-600'}`}
        >
          <Download className={`w-5 h-5 transition-colors ${isExportOpen ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`} />
        </button>

        {isExportOpen && (
          <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-1.5 border-b border-slate-100 pb-2 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Export Dashboard</span>
            </div>
            <div className="space-y-0.5">
              {[
                { label: "PDF Report", ext: ".pdf" },
                { label: "CSV Export", ext: ".csv" },
                { label: "Excel Sheet", ext: ".xlsx" },
                { label: "Revenue Report", ext: ".csv" },
                { label: "Orders Report", ext: ".csv" },
                { label: "Marketing Report", ext: ".pdf" },
                { label: "Customer Report", ext: ".csv" }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setIsExportOpen(false)}
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
