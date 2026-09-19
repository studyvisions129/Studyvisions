import { prisma } from "@/lib/prisma";
import { Plus, Megaphone, Target, MonitorPlay, BarChart, Settings } from "lucide-react";
import { toggleAdPlacement } from "./actions";

export default async function AdsManagerPage() {
  const placements = await prisma.adPlacement.findMany({
    include: {
      units: true,
      _count: {
        select: { units: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ads Manager</h1>
          <p className="text-slate-500 mt-1">Configure and monitor free content monetization rules.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            New Placement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100 shadow-sm">
            <Megaphone className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Impressions</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">0</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100 shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">0</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100 shadow-sm">
            <MonitorPlay className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Placements</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{placements.filter(p => p.isActive).length}</h3>
            <span className="text-sm font-medium text-slate-400">/ {placements.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-900">Ad Placements</h3>
           <span className="text-sm font-medium text-slate-500">Global Visibility Rules applied automatically.</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {placements.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <BarChart className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-700">No placements configured</h4>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">Create ad placements like "Homepage Header" or "Chapter Sidebar" to start monetizing free traffic.</p>
            </div>
          ) : (
            placements.map(placement => (
              <div key={placement.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${placement.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{placement.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">id: {placement.identifier}</p>
                    <div className="mt-2 text-sm text-slate-600 font-medium">
                      {placement._count.units} Active Ad Units
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 self-end sm:self-auto">
                   <form action={toggleAdPlacement.bind(null, placement.id, !placement.isActive)}>
                      <button type="submit" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${placement.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${placement.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                   </form>
                   <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                     <Settings className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
