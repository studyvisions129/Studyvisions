import { Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let orders: any[] = [];
  
  // Logic to fetch order history would go here

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Purchase History</h1>
        <p className="text-slate-500">View your past orders and receipts.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--sv-border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Purchase History</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You haven't made any purchases yet. When you buy courses, notes, or eBooks, they will appear here.
          </p>
          <Link 
            href="/categories" 
            className="btn-primary"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List orders here */}
        </div>
      )}
    </div>
  );
}
