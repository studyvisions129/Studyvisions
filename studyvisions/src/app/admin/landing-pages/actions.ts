"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLandingPage(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.landingPage.create({
    data: {
      title,
      slug,
      content,
      isPublished,
    },
  });

  revalidatePath("/admin/landing-pages");
}

export async function deleteLandingPage(id: string) {
  await prisma.landingPage.delete({
    where: { id }
  });
  revalidatePath("/admin/landing-pages");
}
