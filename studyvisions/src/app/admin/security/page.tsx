import { prisma } from "@/lib/prisma";
import { ShieldCheck, ShieldAlert, History, Activity, AlertTriangle, Users } from "lucide-react";

export default async function SecurityCenterPage() {
  const auditLogs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      admin: { select: { name: true, email: true } }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security & Governance</h1>
            <span className="bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black tracking-widest shadow-md">
              Command Center
            </span>
          </div>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Monitor admin activities, detect anomalous behavior, and ensure platform integrity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-slate-700 shadow-sm relative z-10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider relative z-10">System Status</p>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-white tracking-tight">Secure</h3>
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">All systems nominal</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Actions (24h)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{auditLogs.length}</h3>
            <span className="text-sm font-medium text-slate-400">Events Logged</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 border border-rose-100 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Critical Alerts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">0</h3>
            <span className="text-sm font-medium text-emerald-600">No active threats</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
             <History className="w-5 h-5 text-indigo-500" />
             Admin Audit Log
           </h3>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Export CSV</button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-slate-600">No audit logs found</p>
                      <p className="text-sm mt-1">Admin actions like deletes and price changes will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {log.admin.name?.[0] || 'A'}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{log.admin.name || log.admin.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.action.includes('DELETE') ? 'bg-rose-100 text-rose-700' :
                        log.action.includes('UPDATE') ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {log.entityType} <span className="text-slate-400">#{log.entityId.slice(0, 8)}...</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
