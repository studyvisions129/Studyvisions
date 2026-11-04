"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function toggleAdPlacement(id: string, isActive: boolean) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Ad placement ID is required");
  }

  try {
    await prisma.adPlacement.update({
      where: { id },
      data: { isActive },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "TOGGLE_AD_PLACEMENT",
      entityType: "AdPlacement",
      entityId: id,
      details: { isActive },
    });

    safeRevalidatePath("/admin/ads");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to toggle ad placement", error);
    throw new Error("Failed to toggle ad placement");
  }
}

export async function createAdPlacement(formData: FormData) {
  const admin = await requireAdmin();

  const name = formData.get("name") as string;
  const identifier = formData.get("identifier") as string;

  if (!name || !identifier) {
    throw new Error("Name and identifier are required");
  }
  
  try {
    const placement = await prisma.adPlacement.create({
      data: {
        name,
        identifier,
        isActive: true,
      }
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "CREATE_AD_PLACEMENT",
      entityType: "AdPlacement",
      entityId: placement.id,
      details: { name, identifier },
    });

    safeRevalidatePath("/admin/ads");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to create ad placement", error);
    throw new Error("Failed to create ad placement");
  }
}
