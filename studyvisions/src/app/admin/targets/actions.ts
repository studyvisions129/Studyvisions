"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function saveBusinessTargets(formData: FormData) {
  await requireAdmin();

  const period = (formData.get("period") as string) || "2026-10";
  const revenueTarget = parseFloat(formData.get("revenueTarget") as string);
  const ordersTarget = parseFloat(formData.get("ordersTarget") as string);
  const profitTarget = parseFloat(formData.get("profitTarget") as string);

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (!isNaN(revenueTarget) && revenueTarget > 0) {
    await prisma.businessTarget.upsert({
      where: { targetType_period: { targetType: "REVENUE", period } },
      create: { targetType: "REVENUE", targetValue: revenueTarget, period, startDate, endDate },
      update: { targetValue: revenueTarget, startDate, endDate }
    });
  }

  if (!isNaN(ordersTarget) && ordersTarget > 0) {
    await prisma.businessTarget.upsert({
      where: { targetType_period: { targetType: "ORDERS", period } },
      create: { targetType: "ORDERS", targetValue: ordersTarget, period, startDate, endDate },
      update: { targetValue: ordersTarget, startDate, endDate }
    });
  }

  if (!isNaN(profitTarget) && profitTarget > 0) {
    await prisma.businessTarget.upsert({
      where: { targetType_period: { targetType: "PROFIT", period } },
      create: { targetType: "PROFIT", targetValue: profitTarget, period, startDate, endDate },
      update: { targetValue: profitTarget, startDate, endDate }
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/targets");
}
