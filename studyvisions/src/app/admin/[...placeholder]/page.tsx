import { Hammer } from "lucide-react";
import Link from "next/link";

export default async function AdminPlaceholderPage({ params }: { params: Promise<{ placeholder: string[] }> }) {
  const resolvedParams = await params;
  const pageName = resolvedParams.placeholder.join(" / ");
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
        <Hammer className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2 capitalize">{pageName.replace(/-/g, ' ')}</h1>
      <p className="text-slate-500 max-w-md mb-8">
        This module is part of the StudyVisions Phase 2 Upgrade Plan and is currently under construction. UI and Data connections will be deployed soon.
      </p>
      <Link href="/admin" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
        Back to Dashboard
      </Link>
    </div>
  );
}
