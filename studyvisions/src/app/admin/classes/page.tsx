import { prisma } from "@/lib/prisma";
import { GraduationCap, Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function ClassesPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const whereClause = {
    levelType: 'CLASS' as const,
    ...(query ? { name: { contains: query, mode: 'insensitive' as const } } : {})
  };

  const [classes, totalCount] = await Promise.all([
    prisma.academicLevel.findMany({
      where: whereClause,
      include: {
        parent: true,
        _count: {
          select: { children: true }
        }
      },
      orderBy: { sortOrder: "asc" },
      skip: offset,
      take: limit,
    }),
    prisma.academicLevel.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Classes & Grades</h1>
          <p className="text-slate-500 mt-1">Manage academic classes (e.g., Class 10, Class 12).</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <form action="/admin/classes" method="GET">
              <input
                type="text"
                name="query"
                defaultValue={query}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="Search classes..."
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Class Info</th>
                <th className="px-6 py-4">Parent Board</th>
                <th className="px-6 py-4 text-center">Subjects</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <GraduationCap className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-slate-600">No classes found</p>
                      <p className="text-sm mt-1">Try adjusting your search or add a new one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-sm border border-indigo-50">
                          {cls.name.replace(/[^0-9]/g, '') || cls.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{cls.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5"><code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/{cls.slug}</code></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs">
                        {cls.parent?.name || 'No Board'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {cls._count.children} Subjects
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                        cls.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      )}>
                        {cls.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {cls.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
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
              Showing <span className="font-medium text-slate-900">{offset + 1}</span> to <span className="font-medium text-slate-900">{Math.min(offset + limit, totalCount)}</span> of <span className="font-medium text-slate-900">{totalCount}</span>
            </p>
            <div className="flex items-center gap-2">
              <Link 
                href={currentPage > 1 ? `/admin/classes?page=${currentPage - 1}${query ? `&query=${query}` : ''}` : '#'}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", currentPage > 1 ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Previous
              </Link>
              <Link 
                href={currentPage < totalPages ? `/admin/classes?page=${currentPage + 1}${query ? `&query=${query}` : ''}` : '#'}
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
