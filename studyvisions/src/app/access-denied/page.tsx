import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[var(--sv-border)] shadow-sm text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h1>
        <p className="text-slate-500 mb-8">
          You do not have permission to access the admin panel. If you believe this is a mistake, please contact support.
        </p>

        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="block w-full py-3 px-4 bg-[var(--sv-primary)] hover:bg-[var(--sv-primary-hover)] text-white font-semibold rounded-xl transition-colors"
          >
            Return to Dashboard
          </Link>
          <Link 
            href="/" 
            className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
