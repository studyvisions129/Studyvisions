import { prisma } from "@/lib/prisma";
import { saveSettings } from "../settings/actions";
import { Search } from "lucide-react";

export default async function SeoSettingsPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'seo_' } }
  });

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Search className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">SEO Settings</h1>
          <p className="text-slate-500 text-sm">Configure how your site appears on Google and social media.</p>
        </div>
      </div>

      <form action={saveSettings} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Global Meta Tags</h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Site Title Prefix</label>
            <input type="text" name="setting_seo_title" defaultValue={getSetting('seo_title')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. StudyVisions | " />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Global Meta Description</label>
            <textarea name="setting_seo_description" defaultValue={getSetting('seo_description')} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Default description for pages without one..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
            <input type="text" name="setting_seo_keywords" defaultValue={getSetting('seo_keywords')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. education, courses, notes, cbse" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Social Media (OpenGraph)</h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Default OG Image URL</label>
            <input type="url" name="setting_seo_og_image" defaultValue={getSetting('seo_og_image')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
            <p className="text-xs text-slate-500 mt-2">This image will appear when your links are shared on WhatsApp, Facebook, or Twitter.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-[var(--sv-primary)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Save SEO Settings
          </button>
        </div>
      </form>
    </div>
  );
}
