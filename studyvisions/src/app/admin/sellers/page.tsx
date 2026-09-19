import { prisma } from "@/lib/prisma";
import { Users, CheckCircle, XCircle, Clock, ShieldAlert, BadgeCheck, FileText, IndianRupee } from "lucide-react";
import { updateSellerStatus } from "./actions";

export default async function SellersHubPage() {
  const sellers = await prisma.sellerProfile.findMany({
    include: {
      user: {
        select: { fullName: true, email: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const pendingSellers = sellers.filter(s => s.status === 'PENDING');
  const activeSellers = sellers.filter(s => s.status === 'ACTIVE');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Marketplace Command Center</h1>
            <span className="bg-rose-100 text-rose-600 px-2.5 py-1 rounded-md text-xs uppercase font-black tracking-widest border border-rose-200">
              Private Beta
            </span>
          </div>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Review and onboard verified educators to sell on the StudyVisions Marketplace. Public onboarding is currently disabled.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100 shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{pendingSellers.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100 shadow-sm">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Educators</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activeSellers.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100 shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Marketplace Items</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">0</h3>
            <span className="text-sm font-medium text-slate-400">Products</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 border border-rose-100 shadow-sm">
            <IndianRupee className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Payouts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹0</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-indigo-500" />
             Seller Onboarding Queue
           </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {sellers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-700">No sellers applied yet</h4>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">When educators apply to sell their content, they will appear here for your review.</p>
            </div>
          ) : (
            sellers.map(seller => (
              <div key={seller.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {seller.user.avatarUrl ? (
                      <img src={seller.user.avatarUrl} alt={seller.user.fullName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      {seller.businessName}
                      {seller.status === 'ACTIVE' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                    </h4>
                    <p className="text-sm font-medium text-slate-600 mt-0.5">{seller.user.fullName} &bull; {seller.user.email}</p>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-xl italic line-clamp-2">{seller.businessType || "Retail"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full lg:w-auto">
                  
                  {/* Status Indicator */}
                  <div className="flex flex-col items-start lg:items-end w-full lg:w-32">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</span>
                    {seller.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {seller.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                    {seller.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                    {seller.status === 'SUSPENDED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" /> Suspended
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:border-l lg:border-slate-200 lg:pl-6">
                    {seller.status === 'PENDING' && (
                      <>
                        <form action={updateSellerStatus.bind(null, seller.id, 'ACTIVE')}>
                          <button type="submit" className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold transition-colors">
                            Approve
                          </button>
                        </form>
                        <form action={updateSellerStatus.bind(null, seller.id, 'REJECTED')}>
                          <button type="submit" className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-sm font-bold transition-colors">
                            Reject
                          </button>
                        </form>
                      </>
                    )}
                    
                    {seller.status === 'ACTIVE' && (
                      <form action={updateSellerStatus.bind(null, seller.id, 'SUSPENDED')}>
                        <button type="submit" className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
                          Suspend
                        </button>
                      </form>
                    )}

                    {(seller.status === 'REJECTED' || seller.status === 'SUSPENDED') && (
                      <form action={updateSellerStatus.bind(null, seller.id, 'PENDING')}>
                        <button type="submit" className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
                          Re-evaluate
                        </button>
                      </form>
                    )}
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
