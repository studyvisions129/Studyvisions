import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const categories = await prisma.academicLevel.findMany({
    where: { levelType: "SUBJECT" },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Product</h1>
          <p className="text-slate-500 text-sm">Create a new digital course, notes, or test series.</p>
        </div>
      </div>

      <form action={createProduct} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Complete Physics Notes Class 12" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug</label>
            <input type="text" name="slug" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. physics-notes-class-12" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea name="description" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Product details..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
              <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="NOTES">Notes</option>
                <option value="EBOOK">eBook</option>
                <option value="COURSE">Video Course</option>
                <option value="TEST_SERIES">Test Series</option>
                <option value="BUNDLE">Bundle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select name="status" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800">Pricing & Organization</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <input type="number" step="0.01" name="price" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 199" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Compare-at Price (₹) - Optional</label>
              <input type="number" step="0.01" name="compareAtPrice" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 499" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category (Subject)</label>
            <select name="academicLevelId" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">No Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="isFeatured" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
            <span className="font-semibold text-slate-700">Feature this product on homepage</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-3 font-semibold text-slate-600 hover:text-slate-800">
            Cancel
          </Link>
          <button type="submit" className="px-8 py-3 bg-[var(--sv-primary)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
