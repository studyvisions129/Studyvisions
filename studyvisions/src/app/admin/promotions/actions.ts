"use server";

import { prisma } from "@/lib/prisma";
import { PromotionType } from "@prisma/client";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function createPromotion(formData: FormData) {
  const admin = await requireAdmin();

  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const discountAmountStr = formData.get("discountAmount") as string;
  const type = formData.get("type") as PromotionType;
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  if (!code || !discountAmountStr) {
    throw new Error("Code and discount amount are required");
  }

  const discountAmount = parseFloat(discountAmountStr);
  if (isNaN(discountAmount) || discountAmount <= 0) {
    throw new Error("Discount amount must be a positive number");
  }

  try {
    const promo = await prisma.promotion.create({
      data: {
        code: code.toUpperCase(),
        name: code.toUpperCase(),
        description: description || null,
        discountValue: discountAmount,
        promotionType: type || "STANDARD_COUPON",
        discountType: "PERCENTAGE",
        validFrom: new Date(),
        validUntil: expiresAt,
        isActive: true,
        maxUses,
      }
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "CREATE_PROMOTION",
      entityType: "Promotion",
      entityId: promo.id,
      details: { code: promo.code, discountValue: discountAmount, type },
    });

    safeRevalidatePath("/admin/promotions");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to create promotion", error);
    throw new Error("Failed to create promotion");
  }
}

export async function togglePromotion(id: string, isActive: boolean) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Promotion ID is required");
  }

  try {
    await prisma.promotion.update({
      where: { id },
      data: { isActive },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "TOGGLE_PROMOTION",
      entityType: "Promotion",
      entityId: id,
      details: { isActive },
    });

    safeRevalidatePath("/admin/promotions");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to toggle promotion", error);
    throw new Error("Failed to toggle promotion");
  }
}
