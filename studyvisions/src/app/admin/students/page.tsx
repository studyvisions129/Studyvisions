import { prisma } from "@/lib/prisma";
import { User, Users, Eye, Search, Filter, MoreVertical, ShieldAlert, GraduationCap, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function StudentsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const statusFilter = searchParams?.status || '';
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const whereClause = {
    role: 'STUDENT' as const,
    ...(query ? {
      OR: [
        { fullName: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } }
      ]
    } : {}),
    ...(statusFilter ? {
      isActive: statusFilter === 'active'
    } : {})
  };

  const [students, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        _count: {
          select: { orders: true, purchases: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.user.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-slate-500 mt-1">Manage {totalCount} enrolled students, their profiles, and activities.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <form action="/admin/students" method="GET">
              <input
                type="text"
                name="query"
                defaultValue={query}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="Search students by name or email..."
              />
            </form>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Link 
              href="/admin/students?status=active"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none text-center", statusFilter === 'active' ? "bg-indigo-50 text-indigo-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Active
            </Link>
            <Link 
              href="/admin/students?status=banned"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none text-center", statusFilter === 'banned' ? "bg-rose-50 text-rose-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Banned
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4 text-center">Academics</th>
                <th className="px-6 py-4 text-center">Activity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-slate-600">No students found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-sm border border-indigo-50">
                          {student.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{student.fullName}</div>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Joined {new Date(student.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{student.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{student.phone || 'No phone provided'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {student._count.purchases} Courses
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                          {student.profile?.schoolName ? 'School verified' : 'No school'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-slate-700">{student._count.orders}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Orders</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                        student.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      )}>
                        {student.isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            Active
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            Banned
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/students/${student.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{offset + 1}</span> to <span className="font-medium text-slate-900">{Math.min(offset + limit, totalCount)}</span> of <span className="font-medium text-slate-900">{totalCount}</span> students
            </p>
            <div className="flex items-center gap-2">
              <Link 
                href={currentPage > 1 ? `/admin/students?page=${currentPage - 1}${query ? `&query=${query}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}` : '#'}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", currentPage > 1 ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Previous
              </Link>
              <Link 
                href={currentPage < totalPages ? `/admin/students?page=${currentPage + 1}${query ? `&query=${query}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}` : '#'}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", currentPage < totalPages ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
