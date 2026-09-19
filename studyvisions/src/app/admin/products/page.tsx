import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, Package, Tag, IndianRupee, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProductsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const typeFilter = searchParams?.type || '';
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // Type assertion for ProductType enum
  const validProductTypes = ['NOTES', 'EBOOK', 'TEST_SERIES', 'COURSE', 'BUNDLE'];
  const isValidTypeFilter = validProductTypes.includes(typeFilter);

  const whereClause = {
    ...(query ? { title: { contains: query, mode: 'insensitive' as const } } : {}),
    ...(isValidTypeFilter ? { type: typeFilter as any } : {})
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        academicLevel: true,
        _count: {
          select: { purchases: true, orderItems: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.product.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Catalog</h1>
          <p className="text-slate-500 mt-1">Manage all digital study materials, pricing, and access.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/products/new" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <form action="/admin/products" method="GET">
              <input
                type="text"
                name="query"
                defaultValue={query}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="Search products by title..."
              />
            </form>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <Link 
              href="/admin/products"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", !typeFilter ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              All
            </Link>
            <Link 
              href="/admin/products?type=NOTES"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'NOTES' ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Notes
            </Link>
            <Link 
              href="/admin/products?type=EBOOK"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'EBOOK' ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              eBooks
            </Link>
            <Link 
              href="/admin/products?type=COURSE"
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", typeFilter === 'COURSE' ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Courses
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4 text-center">Type / Category</th>
                <th className="px-6 py-4 text-right">Pricing</th>
                <th className="px-6 py-4 text-center">Sales</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Package className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-slate-600">No products found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or create a new product.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-sm border border-slate-200 overflow-hidden">
                          {product.thumbnailUrl ? (
                            <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div className="max-w-[250px]">
                          <div className="font-bold text-slate-900 truncate" title={product.title}>{product.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate"><code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">/{product.slug}</code></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {product.type.replace('_', ' ')}
                        </span>
                        {product.academicLevel && (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {product.academicLevel.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-slate-900 flex items-center">
                          <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                          {Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-slate-700">{product._count.purchases}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Purchases</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                        product.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        product.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-slate-50 text-slate-600 border-slate-200'
                      )}>
                        {product.status === 'PUBLISHED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {product.status === 'DRAFT' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/landing-page`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit Landing Page">
                          <LayoutTemplate className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit Details">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete Product">
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
                href={currentPage > 1 ? `/admin/products?page=${currentPage - 1}${query ? `&query=${query}` : ''}${typeFilter ? `&type=${typeFilter}` : ''}` : '#'}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", currentPage > 1 ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Previous
              </Link>
              <Link 
                href={currentPage < totalPages ? `/admin/products?page=${currentPage + 1}${query ? `&query=${query}` : ''}${typeFilter ? `&type=${typeFilter}` : ''}` : '#'}
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
