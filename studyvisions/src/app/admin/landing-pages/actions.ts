"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function createLandingPage(formData: FormData) {
  const admin = await requireAdmin();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const productId = formData.get("productId") as string;
  const isPublished = formData.get("isPublished") === "on";

  // New fields
  const goal = formData.get("goal") as string;
  const campaign = formData.get("campaign") as string;
  const audience = formData.get("audience") as string;

  // JSON content payload built from the frontend
  const contentDataRaw = formData.get("contentData") as string;
  const contentData = contentDataRaw ? JSON.parse(contentDataRaw) : {};

  if (!title || !slug) {
    throw new Error("Missing required fields");
  }

  const landingPage = await prisma.landingPage.create({
    data: {
      title,
      slug,
      pageType: "PRODUCT_LANDING_PAGE",
      productId: productId || null,
      goal,
      campaign,
      audience,
      contentData,
      isPublished,
    },
  });

  await logAdminAudit({
    adminId: admin.id,
    action: "CREATE_LANDING_PAGE",
    entityType: "LandingPage",
    entityId: landingPage.id,
    details: { title, slug },
  });

  safeRevalidatePath("/admin/landing-pages");
}

export async function deleteLandingPage(id: string) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Landing Page ID is required");
  }
  
  await prisma.landingPage.delete({
    where: { id }
  });

  await logAdminAudit({
    adminId: admin.id,
    action: "DELETE_LANDING_PAGE",
    entityType: "LandingPage",
    entityId: id,
  });

  safeRevalidatePath("/admin/landing-pages");
}
