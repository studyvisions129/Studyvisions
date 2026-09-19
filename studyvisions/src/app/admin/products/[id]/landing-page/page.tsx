"use client";

import { useState } from "react";
import { ArrowLeft, LayoutTemplate, Plus, Save, GripVertical, Type, Image as ImageIcon, List, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { updateLandingPage } from "./actions";

// Mock initial data for client component (in a real app, this would be fetched server-side and passed as props)
const INITIAL_BLOCKS = [
  { id: '1', type: 'HERO', content: { headline: 'Master Physics in 30 Days', subheadline: 'The ultimate guide for board exams.' } },
  { id: '2', type: 'FEATURES', content: { items: ['150+ Pages', 'Mind Maps', 'PYQ Solutions'] } },
];

export default function LandingPageBuilder({ params }: { params: { id: string } }) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [isSaving, setIsSaving] = useState(false);

  const addBlock = (type: string) => {
    const newBlock = { id: Date.now().toString(), type, content: {} };
    if (type === 'HERO') newBlock.content = { headline: 'New Hero Section', subheadline: 'Add your catchy hook here' };
    if (type === 'FEATURES') newBlock.content = { items: ['Feature 1', 'Feature 2'] };
    if (type === 'TESTIMONIALS') newBlock.content = { reviews: [{ text: 'Great notes!', author: 'Student' }] };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLandingPage(params.id, blocks);
      // Show success toast here
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8 sticky top-0 z-50 bg-[#f8fafc]/90 backdrop-blur-md pt-6 pb-4 border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Landing Page Builder</h1>
            <p className="text-slate-500 text-sm mt-1">Design high-converting sales pages for your products using blocks.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Page"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Toolbox / Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-32">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              Add Block
            </h3>
            <div className="space-y-3">
              <button onClick={() => addBlock('HERO')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-left group">
                <Type className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                <span className="font-semibold text-sm">Hero Section</span>
              </button>
              <button onClick={() => addBlock('FEATURES')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left group">
                <List className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                <span className="font-semibold text-sm">Feature List</span>
              </button>
              <button onClick={() => addBlock('IMAGE_TEXT')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all text-left group">
                <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                <span className="font-semibold text-sm">Image + Text</span>
              </button>
              <button onClick={() => addBlock('TESTIMONIALS')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-all text-left group">
                <Star className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                <span className="font-semibold text-sm">Testimonials</span>
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="text-indigo-800 font-bold text-sm mb-1 flex items-center gap-2">
                     <LayoutTemplate className="w-4 h-4" /> Dynamic Data
                  </h4>
                  <p className="text-xs text-indigo-600/80 leading-relaxed">
                     Pricing and Add-to-Cart buttons are automatically injected at the top and bottom of the rendered page.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-slate-100 rounded-3xl p-6 min-h-[600px] border-2 border-dashed border-slate-200 flex flex-col gap-4">
            
            {blocks.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <LayoutTemplate className="w-16 h-16 mb-4 opacity-20 text-indigo-500" />
                <p className="font-bold text-lg text-slate-600">Canvas is empty</p>
                <p className="text-sm">Click a block from the toolbox to start designing.</p>
              </div>
            )}

            {blocks.map((block, index) => (
              <div key={block.id} className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all">
                
                {/* Block Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1.5 cursor-grab text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button onClick={() => removeBlock(block.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {block.type}
                </div>

                {/* Block Editor UI (Mock) */}
                {block.type === 'HERO' && (
                  <div className="space-y-4">
                    <input type="text" defaultValue={(block.content as any).headline} className="w-full text-2xl font-black bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1" placeholder="Hero Headline" />
                    <input type="text" defaultValue={(block.content as any).subheadline} className="w-full text-lg text-slate-500 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1" placeholder="Subheadline" />
                  </div>
                )}

                {block.type === 'FEATURES' && (
                  <div className="space-y-3">
                    {(block.content as any).items?.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <input type="text" defaultValue={item} className="w-full text-base font-medium bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1" placeholder="Feature..." />
                      </div>
                    ))}
                    <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                      <Plus className="w-4 h-4" /> Add Feature
                    </button>
                  </div>
                )}

                {block.type === 'TESTIMONIALS' && (
                  <div className="space-y-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                     <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                       <Star className="w-4 h-4" /> Review Block
                     </p>
                     <textarea className="w-full text-base italic text-slate-700 bg-white border border-slate-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="Student quote..." defaultValue={(block.content as any).reviews?.[0]?.text}></textarea>
                     <input type="text" defaultValue={(block.content as any).reviews?.[0]?.author} className="w-full text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1" placeholder="- Author Name" />
                  </div>
                )}
                
                {block.type === 'IMAGE_TEXT' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 h-32 text-slate-400 hover:bg-slate-100 hover:border-blue-300 cursor-pointer transition-colors">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                       <input type="text" className="w-full text-lg font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1" placeholder="Section Title" />
                       <textarea className="w-full text-sm text-slate-500 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors p-2 rounded-lg" rows={3} placeholder="Text content here..."></textarea>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
