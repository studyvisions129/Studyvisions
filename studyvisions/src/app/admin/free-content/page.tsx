import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, BookOpen, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function FreeContentPage(props: {
  searchParams?: Promise<{ query?: string; page?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const typeFilter = searchParams?.type || '';
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const validTypes = ['NOTES', 'BOOK', 'EBOOK', 'OBJECTIVE_QNS', 'SUBJECTIVE_QNS', 'PYQ', 'SOLUTION', 'PRACTICE_SET', 'STUDY_MATERIAL'];
  const isValidTypeFilter = validTypes.includes(typeFilter);

  const whereClause = {
    ...(query ? { title: { contains: query, mode: 'insensitive' as const } } : {}),
    ...(isValidTypeFilter ? { contentType: typeFilter as any } : {})
  };

  const [contents, totalCount] = await Promise.all([
    prisma.freeContent.findMany({
      where: whereClause,
      include: {
        academicLevel: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.freeContent.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Free Content CMS</h1>
          <p className="text-slate-500 mt-1">Manage all permanently free, SEO-indexed study materials.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/free-content/new" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            Create Content
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <form action="/admin/free-content" method="GET">
              <input
                type="text"
                name="query"
                defaultValue={query}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="Search free content..."
              />
            </form>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <Link 
              href="/admin/free-content"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", !typeFilter ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              All
            </Link>
            <Link 
              href="/admin/free-content?type=NOTES"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'NOTES' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Notes
            </Link>
            <Link 
              href="/admin/free-content?type=OBJECTIVE_QNS"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'OBJECTIVE_QNS' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              MCQs
            </Link>
            <Link 
              href="/admin/free-content?type=PYQ"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'PYQ' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              PYQs
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Resource Info</th>
                <th className="px-6 py-4">Type & Tag</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Permanence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <BookOpen className="w-12 h-12 mb-3 opacity-20 text-emerald-500" />
                      <p className="font-medium text-slate-600">No free content found</p>
                      <p className="text-sm mt-1">Start creating free, SEO-friendly study material.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="max-w-[300px]">
                          <div className="font-bold text-slate-900 truncate" title={content.title}>{content.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate"><code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">/{content.slug}</code></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 self-start">
                          {content.contentType.replace('_', ' ')}
                        </span>
                        {content.academicLevel && (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {content.academicLevel.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {content.isPublished ? (
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            Published
                         </span>
                      ) : (
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                            Draft
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center text-emerald-600 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100 tooltip" title="This resource is permanently free and safe from accidental deletion.">
                         <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/free-content/${content.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        {/* Note: In a real app we'd have a soft delete / archive form here */}
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group/del" title="Delete Content">
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
                href={currentPage > 1 ? `/admin/free-content?page=${currentPage - 1}${query ? `&query=${query}` : ''}${typeFilter ? `&type=${typeFilter}` : ''}` : '#'}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", currentPage > 1 ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Previous
              </Link>
              <Link 
                href={currentPage < totalPages ? `/admin/free-content?page=${currentPage + 1}${query ? `&query=${query}` : ''}${typeFilter ? `&type=${typeFilter}` : ''}` : '#'}
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
