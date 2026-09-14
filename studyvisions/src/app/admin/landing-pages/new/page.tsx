import { createLandingPage } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLandingPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/landing-pages" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create Landing Page</h1>
          <p className="text-slate-500 text-sm">Build a new promotional or informational page.</p>
        </div>
      </div>

      <form action={createLandingPage} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Page Title</label>
              <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Special Offer 2024" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug</label>
              <input type="text" name="slug" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. special-offer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Page Content (HTML/Markdown)</label>
            <textarea name="content" required rows={12} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="<h1>Welcome</h1>..."></textarea>
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="isPublished" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
            <span className="font-semibold text-slate-700">Publish immediately</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/landing-pages" className="px-6 py-3 font-semibold text-slate-600 hover:text-slate-800">
            Cancel
          </Link>
          <button type="submit" className="px-8 py-3 bg-[var(--sv-primary)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Create Page
          </button>
        </div>
      </form>
    </div>
  );
}
