import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 1. User Authenticated Hai?
  if (!session?.user?.email) {
    redirect(`/auth/login?redirect=/checkout/${resolvedParams.productId}`);
  }

  // 2. Product exists and is published?
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.productId },
    include: {
      academicLevel: true
    }
  });

  if (!product || product.status !== "PUBLISHED") {
    redirect("/"); // Product not available
  }

  // 3. User Database Record
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  // 4. Product already owned?
  const existingPurchase = await prisma.purchase.findUnique({
    where: {
      userId_productId: {
        userId: dbUser.id,
        productId: product.id,
      }
    }
  });

  if (existingPurchase) {
    redirect("/dashboard/library"); // Already owned
  }

  return <CheckoutClient product={product} user={dbUser} />;
}
