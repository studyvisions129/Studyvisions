import { prisma } from "@/lib/prisma";
import { createFreeContent } from "../actions";
import Link from "next/link";
import { ArrowLeft, BookOpen, Save, X, Sparkles, AlertTriangle } from "lucide-react";

export default async function NewFreeContentPage() {
  const categories = await prisma.academicLevel.findMany({
    where: { levelType: "SUBJECT" },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/free-content" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Free Resource</h1>
            <p className="text-slate-500 text-sm mt-1">Publish permanently free, SEO-indexed study material.</p>
          </div>
        </div>
      </div>

      <form action={createFreeContent} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-10 -mt-10"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  Resource Information
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> Permanently Free
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Resource Title <span className="text-rose-500">*</span></label>
                  <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Chapter 1: Real Numbers Full Notes" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug (SEO Friendly) <span className="text-rose-500">*</span></label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 sm:text-sm font-medium">
                      studyvisions.com/free/
                    </span>
                    <input type="text" name="slug" required className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" placeholder="real-numbers-notes-class-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Structured HTML Content <span className="text-rose-500">*</span></span>
                    <button type="button" className="text-emerald-600 text-xs font-bold hover:underline">Apply Template</button>
                  </label>
                  {/* Note: In a real app this would be a Rich Text Editor (e.g. Tiptap) that outputs clean semantic HTML as per the plan */}
                  <textarea name="contentHtml" required rows={12} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm font-mono text-sm" placeholder="<h2>Introduction</h2><p>Real numbers are...</p>"></textarea>
                  <p className="text-xs text-slate-500 mt-2 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    Content will be automatically rendered as semantic, SEO-friendly HTML on the frontend. Ensure you use proper heading tags (h2, h3) for structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                SEO Metadata
              </h3>
              
              <div className="grid grid-cols-1 gap-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Title</label>
                  <input type="text" name="seoTitle" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Best Real Numbers Notes for Class 10 Board Exams" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                  <textarea name="seoDescription" rows={3} className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Get complete chapter-wise notes for..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type <span className="text-rose-500">*</span></label>
                  <select name="contentType" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                    <option value="NOTES">Chapter Notes</option>
                    <option value="PYQ">Previous Year Questions</option>
                    <option value="OBJECTIVE_QNS">Objective Questions (MCQs)</option>
                    <option value="SUBJECTIVE_QNS">Subjective Questions</option>
                    <option value="PRACTICE_SET">Practice Set</option>
                    <option value="SOLUTION">Solutions</option>
                    <option value="EBOOK">Reading eBook</option>
                    <option value="STUDY_MATERIAL">Other Study Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category Mapping</label>
                  <select name="academicLevelId" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer">
                    <option value="">Select Subject/Chapter</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input type="checkbox" name="isPublished" className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 shadow-sm cursor-pointer transition-colors" />
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Publish Immediately</span>
                      <p className="text-slate-500 mt-0.5 leading-snug">Make this resource live and indexable by search engines.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-slate-200">
          <Link href="/admin/free-content" className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
            Cancel
          </Link>
          <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95">
            <Save className="w-5 h-5" />
            Save Resource
          </button>
        </div>
      </form>
    </div>
  );
}
