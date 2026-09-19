export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import * as LucideIcons from "lucide-react";
import { BookOpen, Beaker, Calculator, Code, Atom, Globe, Palette, Languages } from "lucide-react";

const categories = [
  {
    name: "Physics",
    icon: Atom,
    description: "Mechanics, Optics, Thermodynamics aur sab kuch",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    name: "Chemistry",
    icon: Beaker,
    description: "Organic, Inorganic & Physical Chemistry notes",
    count: 38,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    description: "Calculus, Algebra, Trigonometry aur more",
    count: 52,
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    name: "Computer Science",
    icon: Code,
    description: "Python, Java, Data Structures & Algorithms",
    count: 30,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    name: "Biology",
    icon: BookOpen,
    description: "Botany, Zoology aur complete NEET prep",
    count: 41,
    color: "from-green-500 to-lime-500",
    bg: "bg-green-50",
  },
  {
    name: "English",
    icon: Languages,
    description: "Grammar, Literature & Writing Skills",
    count: 22,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    name: "Social Science",
    icon: Globe,
    description: "History, Geography, Civics & Economics",
    count: 35,
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
  },
  {
    name: "Art & Design",
    icon: Palette,
    description: "Fine Arts, Painting & Creative subjects",
    count: 15,
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
  },
];

export default async function CategoriesPage(props: {
  searchParams?: Promise<{ query?: string; type?: string; tag?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const typeFilter = searchParams?.type || "";
  const tagFilter = searchParams?.tag || "";

  // If there's a search query, type filter, or tag filter, we should show products
  const showProducts = query !== "" || typeFilter !== "" || tagFilter !== "";

  const academicLevels = await prisma.academicLevel.findMany({
    where: { levelType: "SUBJECT" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--sv-secondary)] to-slate-800 hero-mesh py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {query ? (
              <>Search Results for <span className="text-gradient">"{query}"</span></>
            ) : showProducts ? (
              <>Browse <span className="text-gradient">Products</span></>
            ) : (
              <>Browse <span className="text-gradient">Categories</span></>
            )}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {query ? `Showing all digital products matching "${query}"` : "Apne subject choose karo aur high-quality study materials dhundo jo tumhare exams crack karne me help karenge."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[var(--sv-surface-dim)] min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {showProducts ? (
            <SearchResults query={query} typeFilter={typeFilter} tagFilter={tagFilter} />
          ) : (
            <>
              {/* Filters - Board selector */}
              <div className="flex flex-wrap gap-3 mb-12">
                {["All Boards", "CBSE", "ICSE", "UP Board", "Bihar Board"].map(
                  (board) => (
                    <button
                      key={board}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        board === "All Boards"
                          ? "bg-[var(--sv-primary)] text-white shadow-md"
                          : "bg-white text-[var(--sv-text-muted)] hover:bg-blue-50 hover:text-[var(--sv-primary)] border border-[var(--sv-border)]"
                      }`}
                    >
                      {board}
                    </button>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {academicLevels.map((cat) => {
                  const Icon = (LucideIcons as any)[cat.iconUrl || "BookOpen"] || LucideIcons.BookOpen;
                  const bgColor = cat.color?.includes("blue") ? "bg-blue-50" 
                                : cat.color?.includes("emerald") ? "bg-emerald-50"
                                : cat.color?.includes("purple") ? "bg-purple-50"
                                : cat.color?.includes("amber") ? "bg-amber-50"
                                : "bg-slate-50";

                  return (
                    <Link
                      href={`/categories/${cat.slug}`}
                      key={cat.id}
                      className="card-hover bg-white rounded-2xl border border-[var(--sv-border)] p-6 group cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-7 h-7 bg-gradient-to-br ${cat.color || 'from-slate-500 to-slate-600'} bg-clip-text`} style={{ color: `var(--sv-primary)` }} />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--sv-secondary)] mb-1 group-hover:text-[var(--sv-primary)] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-[var(--sv-text-muted)] mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
                        {cat.description || `Study materials for ${cat.name}`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--sv-primary)] bg-blue-50 px-3 py-1 rounded-full">
                          {cat._count.products} Resources
                        </span>
                        <span className="text-[var(--sv-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

// Sub-component for search results
async function SearchResults({ query, typeFilter, tagFilter }: { query: string, typeFilter: string, tagFilter: string }) {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(query ? { title: { contains: query, mode: "insensitive" } } : {}),
      ...(typeFilter === "free" ? { price: 0 } : {}),
      ...(tagFilter ? { tags: { has: tagFilter } } : {})
    },
    include: {
      academicLevel: true
    }
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">No products found</h3>
        <p className="text-slate-500">We couldn't find anything matching your criteria. Try adjusting your search.</p>
        <Link href="/categories" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
          View All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="card-hover bg-white rounded-2xl border border-[var(--sv-border)] overflow-hidden group">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
          <div className="p-6">
            {product.tags?.[0] && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-[var(--sv-accent-dark)] mb-3">
                {product.tags[0]}
              </span>
            )}
            <h3 className="text-lg font-bold text-[var(--sv-secondary)] mb-1 group-hover:text-[var(--sv-primary)] transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-[var(--sv-text-muted)] mb-4">
              {product.academicLevel?.name || "General"}
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              {Number(product.price) === 0 ? (
                <span className="text-xl font-bold text-emerald-600">FREE</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-[var(--sv-secondary)]">
                    ₹{Number(product.price)}
                  </span>
                  {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                    <>
                      <span className="text-sm line-through text-slate-400">
                        ₹{Number(product.compareAtPrice)}
                      </span>
                      <span className="text-xs font-semibold text-[var(--sv-success)] ml-1">
                        {Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)}% OFF
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
            <Link 
              href={`/products/${product.slug}`}
              className="block w-full py-2.5 rounded-xl bg-[var(--sv-surface-dim)] text-[var(--sv-primary)] text-center font-semibold text-sm hover:bg-[var(--sv-primary)] hover:text-white transition-all duration-300 border border-blue-100 hover:border-transparent"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
