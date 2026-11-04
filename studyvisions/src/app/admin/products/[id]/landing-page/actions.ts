"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function updateLandingPage(id: string, landingPageData: any) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Product ID is required");
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { landingPageData },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "UPDATE_PRODUCT_LANDING_PAGE",
      entityType: "Product",
      entityId: id,
    });
    
    safeRevalidatePath(`/admin/products/${id}/landing-page`);
    safeRevalidatePath(`/p/[slug]`, 'page');
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to update landing page", error);
    throw new Error("Failed to update landing page data");
  }
}
