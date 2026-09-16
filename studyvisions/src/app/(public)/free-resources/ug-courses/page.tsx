import Link from "next/link";
import { BookOpen, GraduationCap, ArrowLeft, Layers, ChevronRight } from "lucide-react";

export default function UgCoursesFreeResources() {
  const courses = [
    "Arts & Humanities",
    "Commerce & Management",
    "Computer & IT",
    "Science",
    "Engineering & Technology",
    "Medical & Health Sciences",
    "Law",
    "Education",
    "Media & Communication",
    "Social Sciences",
    "Library & Information Science",
    "Agriculture & Allied Sciences",
    "Hotel & Tourism",
    "Design & Fine Arts",
    "Other Undergraduate Courses"
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
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">UG Courses Free Resources</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Access high-quality study materials, notes, and resources for various Undergraduate Courses, completely free of cost.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Undergraduate Streams
            </h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {courses.length} Streams Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {courses.map((courseName, index) => {
              const href = courseName === "Arts & Humanities" 
                ? "/free-resources/ug-courses/arts-and-humanities" 
                : courseName === "Commerce & Management"
                ? "/free-resources/ug-courses/commerce-and-management"
                : courseName === "Computer & IT"
                ? "/free-resources/ug-courses/computer-and-it"
                : "#";
                
              return (
              <Link 
                key={index} 
                href={href}
                className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[160px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {courseName}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    UG Course
                  </p>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
