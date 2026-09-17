"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function CartPage() {
  return (
    <div className="min-h-[70vh] bg-[#F8FAFC] py-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl shadow-blue-900/5 border border-slate-100">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Looks like you haven't added any courses or study materials to your cart yet.
        </p>
        
        <Link 
          href="/categories" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          Explore Resources
        </Link>
        
        <div className="mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
