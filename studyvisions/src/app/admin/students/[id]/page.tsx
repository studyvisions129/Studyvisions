import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { User, Mail, Phone, Calendar, Clock, ShoppingBag, BookOpen, Ban, ShieldCheck, MoreVertical, MapPin, Globe, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function StudentProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await prisma.user.findUnique({
    where: { id: params.id, role: 'STUDENT' },
    include: {
      profile: {
        include: { academicLevel: true }
      },
      sessions: {
        orderBy: { lastSeenAt: 'desc' },
        take: 5
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: { include: { product: true } } }
      },
      purchases: {
        include: { product: true }
      }
    }
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/students" className="hover:text-indigo-600 transition-colors">Students</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Profile</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Profile</h1>
        </div>
        <div className="flex items-center gap-3">
          <form action="" className="flex gap-2">
            <input type="hidden" name="userId" value={student.id} />
            <button 
              type="submit" 
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 shadow-sm",
                student.isActive 
                  ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              )}
            >
              {student.isActive ? (
                <><Ban className="w-4 h-4" /> Suspend Account</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Reactivate Account</>
              )}
            </button>
            <button type="button" className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <MoreVertical className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main ID Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="relative pt-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl mb-4">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-3xl">
                  {student.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{student.fullName}</h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 justify-center">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  student.isActive ? "bg-emerald-500" : "bg-rose-500"
                )}></span>
                {student.isActive ? 'Active Student' : 'Suspended'}
              </p>

              <div className="w-full mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{student.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined {new Date(student.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              Academic Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">School/College</label>
                <div className="flex items-center gap-2 mt-1 text-slate-800 font-medium text-sm">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {student.profile?.schoolName || 'Not provided'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</label>
                  <div className="flex items-center gap-2 mt-1 text-slate-800 font-medium text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {student.profile?.city || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</label>
                  <div className="flex items-center gap-2 mt-1 text-slate-800 font-medium text-sm">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {student.profile?.preferredLang.toUpperCase() || 'HI'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Purchases */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{student.purchases.length}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Courses</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{student.orders.length}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Total Orders</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ₹{student.orders.filter(o => o.status === 'PAID').reduce((acc, curr) => acc + Number(curr.total), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">LTV</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{student.sessions.length}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Logins</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
              <Link href={`/admin/orders?userId=${student.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                View all
              </Link>
            </div>
            <div className="p-0">
              {student.orders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No orders found.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {student.orders.map(order => (
                    <div key={order.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{Number(order.total).toLocaleString('en-IN')}</p>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mt-1",
                          order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Enrolled Courses & Material</h3>
            </div>
            <div className="p-0">
              {student.purchases.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No active enrollments.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {student.purchases.map(purchase => (
                    <div key={purchase.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{purchase.product.title}</p>
                          <p className="text-xs text-slate-500 mt-1">Granted {new Date(purchase.grantedAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                        purchase.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      )}>
                        {purchase.isActive ? 'Active Access' : 'Expired'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
