"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAdPlacement(id: string, isActive: boolean) {
  try {
    await prisma.adPlacement.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/ads");
  } catch (error) {
    console.error("Failed to toggle ad placement", error);
    throw new Error("Failed to toggle ad placement");
  }
}

export async function createAdPlacement(formData: FormData) {
  const name = formData.get("name") as string;
  const identifier = formData.get("identifier") as string;
  
  try {
    await prisma.adPlacement.create({
      data: {
        name,
        identifier,
        isActive: true,
      }
    });
    revalidatePath("/admin/ads");
  } catch (error) {
    console.error("Failed to create ad placement", error);
    throw new Error("Failed to create ad placement");
  }
}
