"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createLandingPage } from "../actions";

export default function LandingPageBuilder({ products }: { products: any[] }) {
  const [contentData, setContentData] = useState({
    hero: { eyebrow: "", heading: "", description: "", primaryCta: "", secondaryCta: "", imageUrl: "" },
    problems: { heading: "What is the biggest problem?", items: [] as { title: string; description: string }[] },
    solution: { heading: "", description: "", cta: "" },
    whatYouGet: { heading: "What's Included?", items: [] as string[] },
    subjects: { heading: "Organized Study Material", items: [] as string[] },
    previews: { heading: "Preview Inside", items: [] as { title: string; imageUrl: string }[], cta: "Get Full Access" },
    benefits: { heading: "Designed for your success", items: [] as { title: string; description: string; icon: string }[] },
    audience: { heading: "Who is this for?", items: [] as string[] },
    howItWorks: { steps: [] as { title: string; description: string }[] },
    trustInfo: { showRefundPolicy: true, securePayment: true, digitalAccess: true },
    faqs: [] as { question: string; answer: string }[]
  });

  const [activeTab, setActiveTab] = useState("basic");
  
  const handleContentChange = (section: keyof typeof contentData, field: string, value: any) => {
    setContentData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const addArrayItem = (section: string, defaultObj: any) => {
    setContentData((prev: any) => {
      if (Array.isArray(prev[section])) {
        return { ...prev, [section]: [...prev[section], defaultObj] };
      }
      return {
        ...prev,
        [section]: { ...prev[section], items: [...prev[section].items, defaultObj] }
      };
    });
  };

  const updateArrayItem = (section: string, index: number, field: string | null, value: any) => {
    setContentData((prev: any) => {
      const isRootArray = Array.isArray(prev[section]);
      const list = isRootArray ? [...prev[section]] : [...prev[section].items];
      
      if (field) {
        list[index] = { ...list[index], [field]: value };
      } else {
        list[index] = value;
      }
      
      return isRootArray 
        ? { ...prev, [section]: list }
        : { ...prev, [section]: { ...prev[section], items: list } };
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    setContentData((prev: any) => {
      const isRootArray = Array.isArray(prev[section]);
      const list = isRootArray ? [...prev[section]] : [...prev[section].items];
      list.splice(index, 1);
      
      return isRootArray 
        ? { ...prev, [section]: list }
        : { ...prev, [section]: { ...prev[section], items: list } };
    });
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "hero", label: "Hero Section" },
    { id: "problem", label: "Problem / Solution" },
    { id: "features", label: "Features & Benefits" },
    { id: "faq", label: "FAQs & Trust" }
  ];

  return (
    <form action={createLandingPage} className="max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/landing-pages" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Landing Page Builder</h1>
            <p className="text-slate-500 text-sm">Create a high-converting landing page.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPublished" defaultChecked className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">Publish Immediately</span>
          </label>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">
            Save Landing Page
          </button>
        </div>
      </div>

      <input type="hidden" name="contentData" value={JSON.stringify(contentData)} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-col gap-2 sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-xl text-left font-semibold text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Basic Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Page Title</label>
                  <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Bihar Board Class 12 Notes & PYQ" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug</label>
                  <input type="text" name="slug" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="bihar-board-class-12-notes-pyq" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Linked Product ⚠️</label>
                <select name="productId" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                  <option value="">-- No Product (Informational Only) --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (₹{Number(p.price)})</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">Prices and Buy buttons will automatically fetch from this product.</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
                  <input type="text" name="goal" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Purchase / Conversion" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign</label>
                  <input type="text" name="campaign" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Exam Prep Campaign" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Audience</label>
                  <input type="text" name="audience" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Class 12 Students" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Hero Section</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Eyebrow (Small top text)</label>
                <input type="text" value={contentData.hero.eyebrow} onChange={(e) => handleContentChange("hero", "eyebrow", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="BSEB CLASS 12 • EXAM PREPARATION" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Main Heading</label>
                <textarea value={contentData.hero.heading} onChange={(e) => handleContentChange("hero", "heading", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 h-20" placeholder="Bihar Board Class 12 की तैयारी करें Complete Notes और PYQs के साथ"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea value={contentData.hero.description} onChange={(e) => handleContentChange("hero", "description", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 h-24" placeholder="Class 12 की पढ़ाई को व्यवस्थित तरीके से करें..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary CTA Text</label>
                  <input type="text" value={contentData.hero.primaryCta} onChange={(e) => handleContentChange("hero", "primaryCta", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Complete Pack प्राप्त करें" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary CTA Text</label>
                  <input type="text" value={contentData.hero.secondaryCta} onChange={(e) => handleContentChange("hero", "secondaryCta", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="क्या-क्या मिलेगा देखें" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Hero Image URL</label>
                <input type="text" value={contentData.hero.imageUrl} onChange={(e) => handleContentChange("hero", "imageUrl", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="/images/product-cover.png" />
              </div>
            </div>
          )}

          {activeTab === "problem" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Problem Section</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Section Heading</label>
                  <input type="text" value={contentData.problems.heading} onChange={(e) => handleContentChange("problems", "heading", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Class 12 की तैयारी में सबसे बड़ी समस्या क्या है?" />
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">Problem Cards</label>
                    <button type="button" onClick={() => addArrayItem("problems", { title: "", description: "" })} className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                      <Plus className="w-3 h-3" /> Add Card
                    </button>
                  </div>
                  
                  {contentData.problems.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 space-y-3">
                        <input type="text" value={item.title} onChange={(e) => updateArrayItem("problems", idx, "title", e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="e.g. Study Material की कमी" />
                        <input type="text" value={item.description} onChange={(e) => updateArrayItem("problems", idx, "description", e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="Description..." />
                      </div>
                      <button type="button" onClick={() => removeArrayItem("problems", idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-8">
                <h2 className="text-xl font-bold text-slate-800">Solution Section</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Section Heading</label>
                  <input type="text" value={contentData.solution.heading} onChange={(e) => handleContentChange("solution", "heading", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="एक जगह पर आपकी Class 12 Preparation Material" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea value={contentData.solution.description} onChange={(e) => handleContentChange("solution", "description", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 h-20" placeholder="StudyVisions का Class 12 Notes..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CTA Button Text</label>
                  <input type="text" value={contentData.solution.cta} onChange={(e) => handleContentChange("solution", "cta", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="Explore the Complete Pack" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">What You'll Get (Items Included)</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Section Heading</label>
                  <input type="text" value={contentData.whatYouGet.heading} onChange={(e) => handleContentChange("whatYouGet", "heading", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="इस Pack में क्या मिलेगा?" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">Included Items</label>
                    <button type="button" onClick={() => addArrayItem("whatYouGet", "")} className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  {contentData.whatYouGet.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <input type="text" value={item} onChange={(e) => updateArrayItem("whatYouGet", idx, null, e.target.value)} className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="e.g. 📘 Class 12 Notes" />
                      <button type="button" onClick={() => removeArrayItem("whatYouGet", idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-8">
                <h2 className="text-xl font-bold text-slate-800">Benefits Section</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Section Heading</label>
                  <input type="text" value={contentData.benefits.heading} onChange={(e) => handleContentChange("benefits", "heading", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" placeholder="आपकी तैयारी को आसान बनाने के लिए बनाया गया" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">Benefit Cards</label>
                    <button type="button" onClick={() => addArrayItem("benefits", { title: "", description: "", icon: "" })} className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                      <Plus className="w-3 h-3" /> Add Benefit
                    </button>
                  </div>
                  {contentData.benefits.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                           <input type="text" value={item.icon} onChange={(e) => updateArrayItem("benefits", idx, "icon", e.target.value)} className="w-16 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="Emoji e.g. 📖" />
                           <input type="text" value={item.title} onChange={(e) => updateArrayItem("benefits", idx, "title", e.target.value)} className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="Better Organization" />
                        </div>
                        <input type="text" value={item.description} onChange={(e) => updateArrayItem("benefits", idx, "description", e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" placeholder="Study material को एक organized जगह पर access करें।" />
                      </div>
                      <button type="button" onClick={() => removeArrayItem("benefits", idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">FAQ List</label>
                    <button type="button" onClick={() => addArrayItem("faqs", { question: "", answer: "" })} className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                      <Plus className="w-3 h-3" /> Add FAQ
                    </button>
                  </div>
                  {contentData.faqs.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 space-y-3">
                        <input type="text" value={item.question} onChange={(e) => updateArrayItem("faqs", idx, "question", e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm font-semibold" placeholder="Q. क्या यह physical book है?" />
                        <textarea value={item.answer} onChange={(e) => updateArrayItem("faqs", idx, "answer", e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm h-16" placeholder="A. नहीं। यह एक digital product है।"></textarea>
                      </div>
                      <button type="button" onClick={() => removeArrayItem("faqs", idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-8">
                 <h2 className="text-xl font-bold text-slate-800">Trust & Risk Reduction</h2>
                 <p className="text-sm text-slate-500">Show trust badges automatically based on selected product policies.</p>
                 <div className="flex flex-col gap-3">
                   <label className="flex items-center gap-3">
                     <input type="checkbox" checked={contentData.trustInfo.securePayment} onChange={(e) => handleContentChange("trustInfo", "securePayment", e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                     <span className="font-semibold text-slate-700">Show Secure Payment Badge</span>
                   </label>
                   <label className="flex items-center gap-3">
                     <input type="checkbox" checked={contentData.trustInfo.digitalAccess} onChange={(e) => handleContentChange("trustInfo", "digitalAccess", e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                     <span className="font-semibold text-slate-700">Show Digital Access Badge</span>
                   </label>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
