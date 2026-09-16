"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Laptop, Monitor, Server, Database, BrainCircuit, 
  Settings, Zap, Factory, Building2, Beaker, Leaf,
  Car, Plane, Activity, Cpu, Box, HardHat, Droplets,
  Tractor, Shirt, Ship, ArrowLeft, ChevronRight 
} from "lucide-react";

export default function EngineeringFreeResources() {
  const [medium, setMedium] = useState<"hindi" | "english">("english"); // Defaulted to english as engineering is predominantly in English, but kept toggle for consistency

  const engCategories = [
    {
      title: "Computer Science & Engineering",
      icon: Laptop,
      subcategories: [
        "Computer Science & Engineering — General",
        "CSE — Artificial Intelligence",
        "CSE — Artificial Intelligence & Machine Learning",
        "CSE — Data Science",
        "CSE — Cyber Security",
        "CSE — Information Security",
        "CSE — Cloud Computing",
        "CSE — Internet of Things",
        "CSE — Blockchain Technology",
        "CSE — Software Engineering",
        "CSE — Big Data Analytics",
        "CSE — Data Analytics",
        "CSE — Computer Networks",
        "CSE — Computer Vision",
        "CSE — Machine Learning",
        "CSE — Computational Intelligence",
        "CSE — IoT & Cyber Security",
        "CSE — AI & Data Engineering",
        "CSE — Full Stack Development"
      ]
    },
    {
      title: "Information Technology",
      icon: Server,
      subcategories: [
        "Information Technology — General",
        "IT — Artificial Intelligence",
        "IT — Data Science",
        "IT — Cyber Security",
        "IT — Cloud Computing",
        "IT — Data Analytics",
        "IT — Software Development",
        "IT — Networking",
        "IT — Information Security",
        "IT — IoT",
        "IT — Blockchain"
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: BrainCircuit,
      subcategories: [
        "Artificial Intelligence",
        "Artificial Intelligence & Machine Learning",
        "Artificial Intelligence & Data Science",
        "Machine Learning",
        "Applied Artificial Intelligence",
        "AI & Robotics",
        "AI & Computer Vision",
        "AI & Natural Language Processing"
      ]
    },
    {
      title: "Data Science & Data Engineering",
      icon: Database,
      subcategories: [
        "B.Tech Data Science",
        "B.Tech AI & Data Science",
        "B.Tech Data Engineering",
        "Data Science & Analytics",
        "Big Data Engineering",
        "Business Analytics",
        "Computational Data Science"
      ]
    },
    { title: "Electronics & Communication", icon: Cpu, subcategories: [] },
    { title: "Electrical", icon: Zap, subcategories: [] },
    { title: "Electrical & Electronics", icon: Zap, subcategories: [] },
    { title: "Mechanical", icon: Settings, subcategories: [] },
    { title: "Civil", icon: Building2, subcategories: [] },
    { title: "Chemical", icon: Beaker, subcategories: [] },
    { title: "Biotechnology", icon: Activity, subcategories: [] },
    { title: "Automobile", icon: Car, subcategories: [] },
    { title: "Aerospace / Aeronautical", icon: Plane, subcategories: [] },
    { title: "Robotics & Automation", icon: Settings, subcategories: [] },
    { title: "Mechatronics", icon: Cpu, subcategories: [] },
    { title: "Instrumentation & Control", icon: Settings, subcategories: [] },
    { title: "Industrial & Production", icon: Factory, subcategories: [] },
    { title: "Materials / Metallurgical", icon: Box, subcategories: [] },
    { title: "Environmental", icon: Leaf, subcategories: [] },
    { title: "Petroleum & Energy", icon: Droplets, subcategories: [] },
    { title: "Mining", icon: HardHat, subcategories: [] },
    { title: "Food Technology", icon: Beaker, subcategories: [] },
    { title: "Agricultural Engineering", icon: Tractor, subcategories: [] },
    { title: "Textile", icon: Shirt, subcategories: [] },
    { title: "Marine / Naval", icon: Ship, subcategories: [] },
    { title: "Biomedical", icon: Activity, subcategories: [] },
    { title: "Other Engineering Programmes", icon: Settings, subcategories: [] }
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
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Engineering & Technology</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Explore diverse engineering branches and access premium study materials for all Engineering & Technology undergraduate programs.
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

        {/* Categories List */}
        <div className="space-y-8">
          {engCategories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">{category.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">
                    {medium === "hindi" ? "Hindi Medium" : "English Medium"}
                  </p>
                </div>
              </div>

              {category.subcategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.subcategories.map((sub, subIdx) => (
                    <Link 
                      key={subIdx}
                      href="#" // Placeholder
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-sm">{sub}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex">
                  <Link 
                    href="#" // Placeholder
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    View Resources <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
