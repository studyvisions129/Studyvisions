import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await prisma.academicLevel.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!category) {
    return {
      title: "Category Not Found - StudyVisions",
    };
  }

  return {
    title: `${category.name} Study Materials - StudyVisions`,
    description: category.description || `Browse study materials for ${category.name} on StudyVisions`,
    openGraph: {
      title: `${category.name} - StudyVisions`,
      description: category.description || `Browse study materials for ${category.name} on StudyVisions`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const category = await prisma.academicLevel.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-[var(--sv-primary)]">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href="/categories" className="hover:text-[var(--sv-primary)]">Categories</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-slate-800 font-medium" aria-current="page">{category.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--sv-secondary)] mb-4">{category.name}</h1>
        <p className="text-lg text-slate-500 mb-10">{category.description || `Explore all products under ${category.name}`}</p>

        {category.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500">We are currently adding products for {category.name}. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <div key={product.id} className="card-hover bg-white rounded-2xl border border-[var(--sv-border)] overflow-hidden group">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--sv-secondary)] mb-1 group-hover:text-[var(--sv-primary)] transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    {Number(product.price) === 0 ? (
                      <span className="text-xl font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="text-2xl font-bold text-[var(--sv-secondary)]">₹{Number(product.price)}</span>
                    )}
                  </div>
                  <Link 
                    href={`/products/${product.slug}`}
                    className="block w-full py-2.5 rounded-xl bg-[var(--sv-surface-dim)] text-[var(--sv-primary)] text-center font-semibold text-sm hover:bg-[var(--sv-primary)] hover:text-white transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
