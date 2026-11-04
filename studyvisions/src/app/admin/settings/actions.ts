"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function saveSettings(formData: FormData) {
  const admin = await requireAdmin();
  
  const entries = Array.from(formData.entries());
  const updatedKeys: string[] = [];
  
  for (const [key, value] of entries) {
    if (typeof value === "string" && key.startsWith("setting_")) {
      const settingKey = key.replace("setting_", "");
      updatedKeys.push(settingKey);
      await prisma.siteSetting.upsert({
        where: { key: settingKey },
        update: { value },
        create: { key: settingKey, value }
      });
    }
  }

  await logAdminAudit({
    adminId: admin.id,
    action: "SAVE_SETTINGS",
    entityType: "SiteSetting",
    details: { updatedKeysCount: updatedKeys.length },
  });

  safeRevalidatePath("/", "layout");
}
