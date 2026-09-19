"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SellerStatus } from "@prisma/client";

export async function updateSellerStatus(sellerId: string, status: SellerStatus) {
  try {
    await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status },
    });
    revalidatePath("/admin/sellers");
  } catch (error) {
    console.error("Failed to update seller status", error);
    throw new Error("Failed to update seller status");
  }
}
