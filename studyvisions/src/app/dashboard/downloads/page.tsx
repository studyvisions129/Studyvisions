import { Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function DownloadsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let downloads = [];
  
  // Logic to fetch downloads would go here

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Downloads</h1>
        <p className="text-slate-500">Manage your downloaded files for offline access.</p>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--sv-border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-6">
            <Download className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Downloads Yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Aapne abhi tak koi bhi file download nahi ki hai. Aap apne purchased notes aur eBooks ko library se download kar sakte hain.
          </p>
          <Link 
            href="/dashboard/library" 
            className="btn-primary"
          >
            Go to My Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* List downloads here */}
        </div>
      )}
    </div>
  );
}
