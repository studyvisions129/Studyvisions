"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

export async function createLandingPage(formData: FormData) {
  await requireAdmin();
  
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

  await prisma.landingPage.create({
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

  revalidatePath("/admin/landing-pages");
}

export async function deleteLandingPage(id: string) {
  await requireAdmin();
  
  await prisma.landingPage.delete({
    where: { id }
  });
  revalidatePath("/admin/landing-pages");
}
