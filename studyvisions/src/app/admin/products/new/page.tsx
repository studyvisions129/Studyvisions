"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, X, BookOpen, Layers, CheckCircle2, Package, IndianRupee, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const WIZARD_STEPS = [
  "Basic Information",
  "Product Content",
  "Pricing",
  "Media",
  "Landing Page",
  "Checkout",
  "Offers",
  "SEO",
  "Tracking",
  "Preview",
  "Publish"
];

export default function ProductCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8 sticky top-0 z-50 bg-[#f8fafc]/90 backdrop-blur-md pt-6 pb-4 border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Creation</h1>
            <p className="text-slate-500 text-sm mt-1">Wizard: {WIZARD_STEPS[currentStep]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Save Draft
          </button>
          <button 
            onClick={() => setCurrentStep(prev => Math.min(WIZARD_STEPS.length - 1, prev + 1))}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Next Step
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Wizard Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm sticky top-32">
            <nav className="space-y-1">
              {WIZARD_STEPS.map((step, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                return (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                      isActive ? "bg-indigo-50 text-indigo-700 font-bold" : 
                      isPast ? "text-slate-600 hover:bg-slate-50" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      isActive ? "bg-indigo-600 text-white" : 
                      isPast ? "bg-slate-200 text-slate-700" : "border border-slate-300 text-slate-400"
                    )}>
                      {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : idx + 1}
                    </div>
                    {step}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[600px]">
          {currentStep === 0 && <StepBasicInformation />}
          {currentStep === 1 && <StepPlaceholder name={WIZARD_STEPS[currentStep]} description="Upload PDFs, Video modules, or link Drive folders." />}
          {currentStep === 2 && <StepPricing />}
          {currentStep === 3 && <StepMedia />}
          {currentStep > 3 && <StepPlaceholder name={WIZARD_STEPS[currentStep]} />}
        </div>
      </div>
    </div>
  );
}

// Sub-components for Steps
function StepBasicInformation() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Type <span className="text-rose-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Ebook', 'PDF', 'Notes', 'Course', 'Video Course', 'Template'].slice(0,4).map(type => (
                <label key={type} className="cursor-pointer group">
                  <input type="radio" name="type" value={type} className="peer sr-only" defaultChecked={type==='Notes'} />
                  <div className="p-3 border border-slate-200 rounded-xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-all text-center">
                    <span className="font-bold text-slate-700 peer-checked:text-indigo-700 block text-sm">{type}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title <span className="text-rose-500">*</span></label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. Master Physics Class 12" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug <span className="text-rose-500">*</span></label>
            <div className="flex shadow-sm rounded-xl overflow-hidden">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium">
                studyvisions.com/p/
              </span>
              <input type="text" className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="master-physics-class-12" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="A catchy one-liner" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700">
              <option>BSEB Class 12</option>
              <option>CBSE Class 10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPricing() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Base Price (₹) <span className="text-rose-500">*</span></label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <IndianRupee className="h-4 w-4 text-slate-400" />
            </div>
            <input type="number" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg" placeholder="199" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Price / Launch Price (₹)</label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <IndianRupee className="h-4 w-4 text-slate-300" />
            </div>
            <input type="number" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="149" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepMedia() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Media Gallery</h2>
      <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer">
        <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <p className="text-lg font-bold text-slate-700">Upload Product Thumbnail</p>
        <p className="text-sm text-slate-500 mt-1">16:9 ratio recommended</p>
      </div>
    </div>
  );
}

function StepPlaceholder({ name, description = "Configure settings for this section." }: { name: string, description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{name}</h2>
      <p className="text-slate-500 max-w-sm mb-8">{description}</p>
      <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-xl text-indigo-700 text-sm font-medium">
        UI Placeholder for {name}
      </div>
    </div>
  );
}
