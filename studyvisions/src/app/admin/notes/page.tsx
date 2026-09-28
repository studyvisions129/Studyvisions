import { BookText, Plus, Layers, FileOutput } from "lucide-react";

export default function NotesBuilderPlaceholder() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notes Builder</h1>
          <p className="text-slate-500 mt-1">Manage hierarchical educational content from Board to Topics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Create Notes Bundle
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <Layers className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Education Content Hierarchy</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          The Notes Builder supports deep hierarchy: Board &rarr; Class &rarr; Subject &rarr; Chapter &rarr; Topic &rarr; Content (Notes, Objective, Subjective, PYQ, VVI).
        </p>
        <div className="flex justify-center gap-4 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><FileOutput className="w-4 h-4" /> Support Free/Paid Toggles</span>
        </div>
      </div>
    </div>
  );
}
