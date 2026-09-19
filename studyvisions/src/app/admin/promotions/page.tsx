import { prisma } from "@/lib/prisma";
import { Ticket, Percent, Plus, Zap, UserX, Send, TrendingUp, ArchiveX, Copy, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { togglePromotion } from "./actions";

export default async function PromotionsPage() {
  const [promotions, abandonedCheckouts] = await Promise.all([
    prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    }),
    prisma.abandonedCheckout.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true, price: true } }
      }
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Growth & Promotions</h1>
          <p className="text-slate-500 mt-1">Drive revenue with targeted discounts and checkout recovery.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-fuchsia-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-fuchsia-700 hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-fuchsia-50 rounded-2xl flex items-center justify-center text-fuchsia-600 mb-4 border border-fuchsia-100 shadow-sm">
            <Ticket className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Campaigns</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{promotions.filter(p => p.isActive).length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 border border-rose-100 shadow-sm">
            <ArchiveX className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Abandoned Checkouts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{abandonedCheckouts.length}</h3>
            <span className="text-sm font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Requires Action</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Revenue Recovered</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹0</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Promotions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-amber-500" />
                 Active Promotions & Coupons
               </h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {promotions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Ticket className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700">No promotions running</h4>
                  <p className="text-slate-500 mt-1 max-w-sm mx-auto">Create a discount code or flash sale to boost your conversions.</p>
                </div>
              ) : (
                promotions.map(promo => (
                  <div key={promo.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${promo.isActive ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {promo.type === 'PERCENTAGE' ? <Percent className="w-6 h-6" /> : <span className="font-black font-mono">₹</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-lg uppercase tracking-wide">{promo.code}</h4>
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{promo.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                            {promo.type === 'PERCENTAGE' ? `${promo.discountAmount}% OFF` : `₹${promo.discountAmount} OFF`}
                          </span>
                          <span className="text-xs text-slate-500">
                            {promo._count.orders} times used
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-auto">
                       <form action={togglePromotion.bind(null, promo.id, !promo.isActive)}>
                          <button type="submit" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${promo.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${promo.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                       </form>
                       <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                         <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                           <Edit className="w-4 h-4" />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Abandoned Checkouts */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <ArchiveX className="w-5 h-5 text-rose-500" />
                 Abandoned Checkouts
               </h3>
             </div>
             <div className="divide-y divide-slate-100">
               {abandonedCheckouts.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 text-sm">
                   <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                   No abandoned checkouts. Your conversion funnel is perfect!
                 </div>
               ) : (
                 abandonedCheckouts.map(checkout => (
                   <div key={checkout.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                     <div className="flex items-center justify-between mb-2">
                       <span className="font-bold text-slate-800 text-sm">{checkout.user.name}</span>
                       <span className="text-xs font-medium text-slate-400">2h ago</span>
                     </div>
                     <p className="text-xs text-slate-500 truncate">{checkout.product.title}</p>
                     <p className="text-sm font-bold text-slate-700 mt-1">₹{Number(checkout.product.price).toLocaleString('en-IN')}</p>
                     
                     <div className="mt-4 flex items-center justify-between gap-2">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${checkout.recovered ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                         {checkout.recovered ? 'Recovered' : 'Pending'}
                       </span>
                       
                       {!checkout.recovered && (
                         <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity">
                           Send Discount <Send className="w-3 h-3" />
                         </button>
                       )}
                     </div>
                   </div>
                 ))
               )}
             </div>
             {abandonedCheckouts.length > 0 && (
               <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                 <button className="text-sm font-bold text-slate-600 hover:text-slate-900">View All Checkouts</button>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
