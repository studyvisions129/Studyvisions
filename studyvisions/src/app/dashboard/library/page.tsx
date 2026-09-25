import { BookOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import LibraryAccessButton from "./LibraryAccessButton";

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let purchases: any[] = [];
  
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (dbUser) {
      purchases = await prisma.purchase.findMany({
        where: { userId: dbUser.id },
        include: { product: true }
      });
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Library</h1>
        <p className="text-slate-500">Access all your purchased study materials here.</p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--sv-border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Library is Empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Aapne abhi tak koi digital product purchase nahi kiya hai. Explore our catalog to find the best study materials.
          </p>
          <Link 
            href="/categories" 
            className="btn-primary"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-2xl border border-[var(--sv-border)] p-5 hover:shadow-md transition-shadow">
               {/* Product thumbnail placeholder */}
               <div className="w-full aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400">
                  <BookOpen className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-slate-800 mb-1">{purchase.product.title}</h3>
               <p className="text-xs text-slate-500 mb-4">{purchase.product.type}</p>
               <LibraryAccessButton productId={purchase.product.id} href={`/dashboard/library/viewer/${purchase.product.id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
