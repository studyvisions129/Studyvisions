"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PromotionType } from "@prisma/client";

export async function createPromotion(formData: FormData) {
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const discountAmount = parseFloat(formData.get("discountAmount") as string);
  const type = formData.get("type") as PromotionType;
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  try {
    await prisma.promotion.create({
      data: {
        code: code.toUpperCase(),
        name: code.toUpperCase(),
        description,
        discountValue: discountAmount,
        promotionType: type || 'STANDARD_COUPON',
        discountType: 'PERCENTAGE',
        validFrom: new Date(),
        validUntil: expiresAt,
        isActive: true,
        maxUses,
      }
    });
    revalidatePath("/admin/promotions");
  } catch (error) {
    console.error("Failed to create promotion", error);
    throw new Error("Failed to create promotion");
  }
}

export async function togglePromotion(id: string, isActive: boolean) {
  try {
    await prisma.promotion.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/promotions");
  } catch (error) {
    console.error("Failed to toggle promotion", error);
    throw new Error("Failed to toggle promotion");
  }
}
