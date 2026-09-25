import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="min-h-[70vh] bg-[#F8FAFC] py-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl shadow-green-900/5 border border-slate-100">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">Payment Successful!</h1>
        <p className="text-slate-500 mb-2 leading-relaxed">
          Your order has been processed successfully. You now have full access to your purchased materials.
        </p>
        {searchParams.orderId && (
           <p className="text-xs text-slate-400 font-mono mb-8">
             Order ID: {searchParams.orderId}
           </p>
        )}
        
        <Link 
          href="/dashboard/library" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
        >
          Go to My Library
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
