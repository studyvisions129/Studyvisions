"use server";

import { prisma } from "@/lib/prisma";
import { SellerStatus } from "@prisma/client";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function updateSellerStatus(sellerId: string, status: SellerStatus) {
  const admin = await requireAdmin();

  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const validStatuses: SellerStatus[] = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid seller status");
  }

  try {
    await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "UPDATE_SELLER_STATUS",
      entityType: "SellerProfile",
      entityId: sellerId,
      details: { status },
    });

    safeRevalidatePath("/admin/sellers");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to update seller status", error);
    throw new Error("Failed to update seller status");
  }
}
