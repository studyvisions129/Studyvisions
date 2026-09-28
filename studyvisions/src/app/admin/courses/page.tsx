import { GraduationCap, Plus, FolderTree, Video, FileText } from "lucide-react";

export default function CourseBuilderPlaceholder() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Course Builder</h1>
          <p className="text-slate-500 mt-1">Manage and structure your video courses with sections, lessons, and quizzes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <FolderTree className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Architecture</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          The new Course Builder will allow hierarchical structuring: Course &rarr; Sections &rarr; Lessons (Video, Audio, PDF, Quiz, MCQ, Assignment).
        </p>
        <div className="flex justify-center gap-4 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><Video className="w-4 h-4" /> Video lessons</span>
          <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><FileText className="w-4 h-4" /> Assignments</span>
        </div>
      </div>
    </div>
  );
}
