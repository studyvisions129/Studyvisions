import { Lightbulb, Search, CheckCircle, ListTodo, Hammer, Rocket, Megaphone, TrendingUp, Archive, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STAGES = [
  { name: "Ideas", icon: Lightbulb, count: 4, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Research", icon: Search, count: 2, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Validation", icon: CheckCircle, count: 1, color: "text-indigo-500", bg: "bg-indigo-50" },
  { name: "Planning", icon: ListTodo, count: 3, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Production", icon: Hammer, count: 5, color: "text-rose-500", bg: "bg-rose-50" },
  { name: "Ready", icon: CheckCircle, count: 2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Launch", icon: Rocket, count: 1, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Marketing", icon: Megaphone, count: 3, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "Optimization", icon: TrendingUp, count: 4, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Archived", icon: Archive, count: 12, color: "text-slate-500", bg: "bg-slate-50" },
];

export default function ProductPlannerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Planner</h1>
          <p className="text-slate-500 mt-1">Manage the entire lifecycle of your digital products from idea to optimization.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          New Product Plan
        </button>
      </div>

      {/* Kanban / Pipeline View Placeholder */}
      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {STAGES.map((stage) => (
          <div key={stage.name} className="flex-none w-80 bg-slate-100/50 rounded-3xl p-4 border border-slate-200 snap-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", stage.bg)}>
                  <stage.icon className={cn("w-4 h-4", stage.color)} />
                </div>
                <h3 className="font-bold text-slate-800">{stage.name}</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                {stage.count}
              </span>
            </div>

            <div className="space-y-3">
              {/* Dummy Cards */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Course
                  </span>
                  <span className="text-xs text-slate-400">2d ago</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">Mastering Next.js 14</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Complete guide to App Router and Server Actions.</p>
              </div>

              {stage.count > 1 && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Ebook
                    </span>
                    <span className="text-xs text-slate-400">5d ago</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">100 React Patterns</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">Advanced design patterns for modern React applications.</p>
                </div>
              )}
            </div>

            <button className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-semibold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
