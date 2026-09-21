import { prisma } from "@/lib/prisma";
import LandingPageBuilder from "./LandingPageBuilder";

export default async function NewLandingPage() {
  const products = await prisma.product.findMany({
    select: { id: true, title: true, price: true, status: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <LandingPageBuilder products={products} />
    </div>
  );
}
