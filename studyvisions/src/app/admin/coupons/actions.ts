"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const discountType = formData.get("discountType") as "FLAT" | "PERCENTAGE";
  const discountValue = parseFloat(formData.get("discountValue") as string);
  const minOrderAmount = formData.get("minOrderAmount") ? parseFloat(formData.get("minOrderAmount") as string) : null;
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;
  const validFrom = formData.get("validFrom") as string;
  const validUntil = formData.get("validUntil") as string;

  if (!code || isNaN(discountValue) || !validFrom) {
    throw new Error("Missing required fields");
  }

  await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxUses,
      validFrom: new Date(validFrom),
      validUntil: validUntil ? new Date(validUntil) : null,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({
    where: { id }
  });
  revalidatePath("/admin/coupons");
}
