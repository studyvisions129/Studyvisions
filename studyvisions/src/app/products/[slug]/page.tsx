import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Lock, FileText, Download, BookOpen, Star } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      academicLevel: true,
      chapters: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const discountPercentage = Math.round(
    ((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100
  );

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
                <span className="text-slate-800 font-medium" aria-current="page">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content (Left) */}
          <div className="lg:w-2/3">
            
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--sv-border)] mb-8 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600`} />
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[var(--sv-primary)]">
                  {product.type}
                </span>
                {product.tags.map((tag) => (
                  <span key={tag} className="inline-block text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--sv-secondary)] mb-4 leading-tight">
                {product.title}
              </h1>
              
              <p className="text-lg text-[var(--sv-text-muted)] leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">CBSE • {product.academicLevel?.name || 'Class'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{product.totalPages} Pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{product.fileSize} PDF</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current opacity-50" />
                  <span className="text-sm font-medium text-slate-700 ml-1">4.8 (120 reviews)</span>
                </div>
              </div>
            </div>

            {/* Curriculum/Chapters Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--sv-border)]">
              <h2 className="text-2xl font-bold text-[var(--sv-secondary)] mb-6">Course Content</h2>
              
              <div className="space-y-3">
                {product.chapters.map((chapter, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-800">{chapter.title}</span>
                    </div>
                    <div>
                      {chapter.isFree ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">Preview</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-[var(--sv-border)] sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-[var(--sv-secondary)]">₹{Number(product.price)}</span>
                  <span className="text-xl line-through text-slate-400 font-medium">₹{Number(product.compareAtPrice)}</span>
                </div>
                <div className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                  {discountPercentage}% OFF applied
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button className="btn-primary w-full !py-4 text-lg shadow-blue-500/25 shadow-lg flex justify-center items-center gap-2">
                  Buy Now
                </button>
                <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-[var(--sv-primary)] hover:text-[var(--sv-primary)] transition-colors">
                  Add to Cart
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">What you'll get:</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Lifetime access to all {product.totalPages} pages</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Downloadable high-quality PDF</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Access on mobile, tablet, and desktop</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Free updates for 1 year</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
