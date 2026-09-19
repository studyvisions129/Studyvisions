import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Info, IndianRupee, Tag, Save, X } from "lucide-react";

export default async function NewProductPage() {
  const categories = await prisma.academicLevel.findMany({
    where: { levelType: "SUBJECT" },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Product</h1>
            <p className="text-slate-500 text-sm mt-1">Publish a new digital asset to the catalog.</p>
          </div>
        </div>
      </div>

      <form action={createProduct} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <Info className="w-5 h-5 text-indigo-500" />
                Basic Information
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title <span className="text-rose-500">*</span></label>
                  <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm" placeholder="e.g. Complete Physics Notes Class 12" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug <span className="text-rose-500">*</span></label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 sm:text-sm font-medium">
                      studyvisions.com/p/
                    </span>
                    <input type="text" name="slug" required className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="physics-notes-class-12" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea name="description" rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm" placeholder="Detailed product description, syllabus, and features..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <IndianRupee className="w-5 h-5 text-emerald-500" />
                Pricing & Status
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Selling Price (₹) <span className="text-rose-500">*</span></label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="number" step="0.01" name="price" required className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" placeholder="199.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-slate-500">Compare-at Price (₹)</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <IndianRupee className="h-4 w-4 text-slate-300" />
                    </div>
                    <input type="number" step="0.01" name="compareAtPrice" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" placeholder="499.00" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-500" />
                Organization
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Type <span className="text-rose-500">*</span></label>
                  <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                    <option value="NOTES">Notes / PDF</option>
                    <option value="EBOOK">eBook</option>
                    <option value="COURSE">Video Course</option>
                    <option value="TEST_SERIES">Test Series</option>
                    <option value="BUNDLE">Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category (Subject)</label>
                  <select name="academicLevelId" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                    <option value="">No Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Visibility Status <span className="text-rose-500">*</span></label>
                  <select name="status" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                    <option value="DRAFT">Draft (Hidden)</option>
                    <option value="PUBLISHED">Published (Visible)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input type="checkbox" name="isFeatured" className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 shadow-sm cursor-pointer transition-colors" />
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Feature Product</span>
                      <p className="text-slate-500 mt-0.5 leading-snug">Highlight this on the storefront homepage.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                Thumbnail
              </h3>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-slate-200">
          <Link href="/admin/products" className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
            Cancel
          </Link>
          <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95">
            <Save className="w-5 h-5" />
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}
