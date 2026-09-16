"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowLeft, Layers, ChevronRight, Palette } from "lucide-react";

export default function DesignAndFineArtsFreeResources() {
  const [medium, setMedium] = useState<"hindi" | "english">("english");

  const subjects = [
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Design (B.Des)",
    "Fashion Design",
    "Interior Design",
    "Graphic Design",
    "Animation/VFX related UG programmes"
];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="bg-[#0b1b42] text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/free-resources/ug-courses" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to UG Courses
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Design & Fine Arts</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            High-quality free study materials, notes, and resources for various Design & Fine Arts undergraduate programs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Medium Toggle */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Your Medium</h2>
          <div className="inline-flex bg-slate-200/50 p-1.5 rounded-2xl shadow-inner border border-slate-200">
            <button
              onClick={() => setMedium("hindi")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                medium === "hindi" 
                  ? "bg-white text-blue-600 shadow-md transform scale-105" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              Hindi Medium
            </button>
            <button
              onClick={() => setMedium("english")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                medium === "english" 
                  ? "bg-white text-blue-600 shadow-md transform scale-105" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              English Medium
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              {medium === "hindi" ? "Hindi Medium Subjects" : "English Medium Subjects"}
            </h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {subjects.length} Subjects
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {subjects.map((subject, index) => (
              <Link 
                key={index} 
                href={`#`}
                className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {subject}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    {medium === "hindi" ? "Hindi Medium" : "English Medium"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
