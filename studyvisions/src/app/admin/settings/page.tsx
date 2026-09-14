import { prisma } from "@/lib/prisma";
import { saveSettings } from "./actions";
import { Settings } from "lucide-react";

export default async function GlobalSettingsPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'site_' } }
  });

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-slate-100 rounded-xl">
          <Settings className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Website Settings</h1>
          <p className="text-slate-500 text-sm">Configure global platform settings, payments, and contact details.</p>
        </div>
      </div>

      <form action={saveSettings} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">General Info</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Platform Name</label>
              <input type="text" name="setting_site_name" defaultValue={getSetting('site_name')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="StudyVisions" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
              <input type="email" name="setting_site_email" defaultValue={getSetting('site_email')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="support@studyvisions.com" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Support Phone Number</label>
            <input type="text" name="setting_site_phone" defaultValue={getSetting('site_phone')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Payment Integration (Razorpay)</h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Razorpay Key ID</label>
            <input type="text" name="setting_site_razorpay_key" defaultValue={getSetting('site_razorpay_key')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" placeholder="rzp_live_..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Razorpay Key Secret</label>
            <input type="password" name="setting_site_razorpay_secret" defaultValue={getSetting('site_razorpay_secret')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" placeholder="••••••••••••" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Social Links</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
              <input type="url" name="setting_site_social_instagram" defaultValue={getSetting('site_social_instagram')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">YouTube URL</label>
              <input type="url" name="setting_site_social_youtube" defaultValue={getSetting('site_social_youtube')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telegram URL</label>
              <input type="url" name="setting_site_social_telegram" defaultValue={getSetting('site_social_telegram')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://t.me/..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-[var(--sv-primary)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
