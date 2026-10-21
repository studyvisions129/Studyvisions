import { prisma } from "@/lib/prisma";
import { ShoppingBag, Eye, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

interface OrdersPageProps {
  searchParams?: Promise<{ status?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const statusFilter = resolvedParams?.status;

  const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"];
  const normalizedStatus = statusFilter 
    ? validStatuses.find(s => s.toLowerCase() === statusFilter.toLowerCase())
    : undefined;

  const whereClause: any = {};
  if (normalizedStatus) {
    whereClause.status = normalizedStatus;
  }

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    })
  ]);

  const countByStatus: Record<string, number> = {
    ALL: 0,
    PAID: 0,
    PENDING: 0,
    FAILED: 0,
    REFUNDED: 0,
    CANCELLED: 0
  };

  for (const c of counts) {
    countByStatus[c.status] = c._count.id;
    countByStatus.ALL += c._count.id;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
          </div>
          <p className="text-slate-500 text-sm">Authoritative list of all customer checkout transactions.</p>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link 
            href="/admin/orders" 
            className={`px-3 py-1.5 rounded-xl border transition-all ${!normalizedStatus ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            All ({countByStatus.ALL})
          </Link>
          <Link 
            href="/admin/orders?status=Paid" 
            className={`px-3 py-1.5 rounded-xl border transition-all ${normalizedStatus === 'PAID' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'}`}
          >
            Paid ({countByStatus.PAID})
          </Link>
          <Link 
            href="/admin/orders?status=Pending" 
            className={`px-3 py-1.5 rounded-xl border transition-all ${normalizedStatus === 'PENDING' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-amber-700 border-slate-200 hover:bg-amber-50'}`}
          >
            Pending ({countByStatus.PENDING})
          </Link>
          <Link 
            href="/admin/orders?status=Failed" 
            className={`px-3 py-1.5 rounded-xl border transition-all ${normalizedStatus === 'FAILED' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50'}`}
          >
            Failed ({countByStatus.FAILED})
          </Link>
          <Link 
            href="/admin/orders?status=Refunded" 
            className={`px-3 py-1.5 rounded-xl border transition-all ${normalizedStatus === 'REFUNDED' ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-purple-700 border-slate-200 hover:bg-purple-50'}`}
          >
            Refunded ({countByStatus.REFUNDED})
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Gateway Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No orders found matching the selected filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-indigo-500" />
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.user?.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.items.map(i => i.product.title).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        order.status === 'FAILED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        order.status === 'REFUNDED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {order.razorpayPaymentId || order.razorpayOrderId || "—"}
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
