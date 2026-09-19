"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFreeContent(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentType = formData.get("contentType") as any;
  const contentHtml = formData.get("contentHtml") as string;
  const isPublished = formData.get("isPublished") === "on";
  const academicLevelId = formData.get("academicLevelId") as string || null;
  const seoTitle = formData.get("seoTitle") as string || null;
  const seoDescription = formData.get("seoDescription") as string || null;

  try {
    await prisma.freeContent.create({
      data: {
        title,
        slug,
        contentType,
        contentHtml,
        isPublished,
        academicLevelId,
        seoTitle,
        seoDescription,
        isPermanentlyFree: true,
      },
    });
  } catch (error) {
    console.error("Failed to create free content", error);
    throw new Error("Failed to create free content");
  }

  revalidatePath("/admin/free-content");
  redirect("/admin/free-content");
}

export async function updateFreeContent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentType = formData.get("contentType") as any;
  const contentHtml = formData.get("contentHtml") as string;
  const isPublished = formData.get("isPublished") === "on";
  const academicLevelId = formData.get("academicLevelId") as string || null;
  const seoTitle = formData.get("seoTitle") as string || null;
  const seoDescription = formData.get("seoDescription") as string || null;

  try {
    await prisma.freeContent.update({
      where: { id },
      data: {
        title,
        slug,
        contentType,
        contentHtml,
        isPublished,
        academicLevelId,
        seoTitle,
        seoDescription,
      },
    });
  } catch (error) {
    console.error("Failed to update free content", error);
    throw new Error("Failed to update free content");
  }

  revalidatePath("/admin/free-content");
  redirect("/admin/free-content");
}

export async function deleteFreeContent(id: string) {
  try {
    await prisma.freeContent.delete({
      where: { id },
    });
    revalidatePath("/admin/free-content");
  } catch (error) {
    console.error("Failed to delete free content", error);
    throw new Error("Failed to delete free content");
  }
}
