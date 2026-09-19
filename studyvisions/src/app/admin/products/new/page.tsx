import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Info, IndianRupee, Tag, Save, X, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export default async function ProductCreationStudioPage() {
  const categories = await prisma.academicLevel.findMany({
    where: { levelType: "SUBJECT" },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8 sticky top-0 z-50 bg-[#f8fafc]/90 backdrop-blur-md pt-6 pb-4 border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Creation Studio</h1>
            <p className="text-slate-500 text-sm mt-1">Design and publish your digital product in 5 simple steps.</p>
          </div>
        </div>
      </div>

      <form action={createProduct} className="space-y-12">
        
        {/* Step 1: Product Type */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">1</div>
            <h3 className="text-xl font-bold text-slate-900">Product Type</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="cursor-pointer group">
              <input type="radio" name="type" value="PREMIUM_NOTES" className="peer sr-only" required defaultChecked />
              <div className="p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-all text-center">
                <BookOpen className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <span className="font-bold text-slate-700 peer-checked:text-indigo-700 block text-sm">Premium Note</span>
              </div>
            </label>
            <label className="cursor-pointer group">
              <input type="radio" name="type" value="COURSE" className="peer sr-only" required />
              <div className="p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-all text-center">
                <Layers className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <span className="font-bold text-slate-700 peer-checked:text-indigo-700 block text-sm">Video Course</span>
              </div>
            </label>
            <label className="cursor-pointer group">
              <input type="radio" name="type" value="TEST_SERIES" className="peer sr-only" required />
              <div className="p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-all text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="font-bold text-slate-700 peer-checked:text-indigo-700 block text-sm">Test Series</span>
              </div>
            </label>
            <label className="cursor-pointer group">
              <input type="radio" name="type" value="BUNDLE" className="peer sr-only" required />
              <div className="p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-all text-center">
                <Package className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <span className="font-bold text-slate-700 peer-checked:text-indigo-700 block text-sm">Bundle</span>
              </div>
            </label>
          </div>
        </div>

        {/* Step 2: Basic Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-md shadow-slate-800/20">2</div>
            <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title <span className="text-rose-500">*</span></label>
              <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="e.g. Master Physics Class 12" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug <span className="text-rose-500">*</span></label>
              <div className="flex shadow-sm rounded-xl overflow-hidden">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 sm:text-sm font-medium">
                  studyvisions.com/p/
                </span>
                <input type="text" name="slug" required className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="master-physics-class-12" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle / Short Description</label>
              <input type="text" name="shortDescription" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="A one-line catchy subtitle for the product card..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
              <textarea name="description" rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Detailed product description, syllabus, and what's included..."></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                <select name="language" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                  <option value="Hindi">Hindi (BSEB)</option>
                  <option value="English">English</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Pages (for Notes)</label>
                <input type="number" name="totalPages" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="e.g. 150" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Academic Mapping */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">3</div>
            <h3 className="text-xl font-bold text-slate-900">Academic Mapping</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category (Subject / Board)</label>
            <select name="academicLevelId" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
              <option value="">No Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">Linking a product to a category improves SEO and helps in upselling from free content.</p>
          </div>
        </div>

        {/* Step 4: Assets */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">4</div>
            <h3 className="text-xl font-bold text-slate-900">Assets & Thumbnail</h3>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center bg-slate-50 hover:bg-slate-100 hover:border-sky-400 transition-all cursor-pointer group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-sky-500" />
            </div>
            <p className="text-base font-bold text-slate-700">Click to upload Product Thumbnail</p>
            <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB (16:9 ratio recommended)</p>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">Digital delivery assets (PDFs/Videos) can be uploaded after creating the product.</p>
        </div>

        {/* Step 5: Pricing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">5</div>
            <h3 className="text-xl font-bold text-slate-900">Pricing & Status</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Selling Price (₹) <span className="text-rose-500">*</span></label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <IndianRupee className="h-4 w-4 text-slate-400" />
                </div>
                <input type="number" step="0.01" name="price" required className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-lg" placeholder="199.00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Compare-at Price / MRP (₹)</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <IndianRupee className="h-4 w-4 text-slate-300" />
                </div>
                <input type="number" step="0.01" name="compareAtPrice" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-500" placeholder="499.00" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Visibility Status <span className="text-rose-500">*</span></label>
              <select name="status" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm cursor-pointer">
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published (Live on Store)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input type="checkbox" name="isFeatured" className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 shadow-sm cursor-pointer transition-colors" />
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Feature Product</span>
                  <p className="text-slate-500 mt-0.5 leading-snug">Highlight this product on the main storefront homepage.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-xl shadow-slate-900/20 sticky bottom-6 z-50">
          <Link href="/admin/products" className="flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-slate-300 hover:text-white transition-all">
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Cancel</span>
          </Link>
          <button type="submit" className="flex items-center gap-2 px-6 sm:px-10 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg rounded-2xl hover:from-indigo-400 hover:to-purple-400 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95">
            <Save className="w-6 h-6" />
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
