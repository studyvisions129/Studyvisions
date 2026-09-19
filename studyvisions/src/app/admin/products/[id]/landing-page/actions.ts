"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLandingPage(id: string, landingPageData: any) {
  try {
    await prisma.product.update({
      where: { id },
      data: { landingPageData },
    });
    
    revalidatePath(`/admin/products/${id}/landing-page`);
    revalidatePath(`/p/[slug]`, 'page');
  } catch (error) {
    console.error("Failed to update landing page", error);
    throw new Error("Failed to update landing page data");
  }
}
