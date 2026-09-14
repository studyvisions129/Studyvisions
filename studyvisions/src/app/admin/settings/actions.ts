"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (typeof value === "string" && key.startsWith("setting_")) {
      const settingKey = key.replace("setting_", "");
      await prisma.siteSetting.upsert({
        where: { key: settingKey },
        update: { value },
        create: { key: settingKey, value }
      });
    }
  }

  revalidatePath("/", "layout");
}
