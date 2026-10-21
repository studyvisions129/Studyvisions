import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Target, Save, CheckCircle2 } from "lucide-react";
import { saveBusinessTargets } from "./actions";

export default async function BusinessTargetsPage() {
  const currentPeriod = "2026-10";

  const targets = await prisma.businessTarget.findMany({
    where: { period: currentPeriod }
  });

  const revTarget = targets.find(t => t.targetType === "REVENUE")?.targetValue || 500000;
  const ordTarget = targets.find(t => t.targetType === "ORDERS")?.targetValue || 2000;
  const profTarget = targets.find(t => t.targetType === "PROFIT")?.targetValue || 200000;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              Business Target Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure monthly operational targets for Revenue, Orders, and Profit.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <form action={saveBusinessTargets} className="space-y-6">
          <input type="hidden" name="period" value={currentPeriod} />

          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Monthly Targets ({currentPeriod})</h2>
            <p className="text-xs text-slate-400 mt-1">
              These targets dynamically power the Command Center progress bars and Action Center notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Monthly Revenue Target (₹)
              </label>
              <input 
                type="number"
                name="revenueTarget"
                defaultValue={Number(revTarget)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Monthly Orders Target
              </label>
              <input 
                type="number"
                name="ordersTarget"
                defaultValue={Number(ordTarget)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Monthly Profit Target (₹)
              </label>
              <input 
                type="number"
                name="profitTarget"
                defaultValue={Number(profTarget)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Targets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
