"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath, safeRedirect } from "@/lib/auth-utils";

export async function createFreeContent(formData: FormData) {
  const admin = await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentType = formData.get("contentType") as any;
  const contentHtml = formData.get("contentHtml") as string;
  const isPublished = formData.get("isPublished") === "on";
  const academicLevelId = (formData.get("academicLevelId") as string) || null;
  const seoTitle = (formData.get("seoTitle") as string) || null;
  const seoDescription = (formData.get("seoDescription") as string) || null;

  if (!title || !slug || !contentHtml) {
    throw new Error("Title, slug, and content are required");
  }

  let createdContentId: string;
  try {
    const content = await prisma.freeContent.create({
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
    createdContentId = content.id;

    await logAdminAudit({
      adminId: admin.id,
      action: "CREATE_FREE_CONTENT",
      entityType: "FreeContent",
      entityId: content.id,
      details: { title: content.title, slug: content.slug },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to create free content", error);
    throw new Error("Failed to create free content");
  }

  safeRevalidatePath("/admin/free-content");
  safeRedirect("/admin/free-content");
}

export async function updateFreeContent(id: string, formData: FormData) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Content ID is required");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentType = formData.get("contentType") as any;
  const contentHtml = formData.get("contentHtml") as string;
  const isPublished = formData.get("isPublished") === "on";
  const academicLevelId = (formData.get("academicLevelId") as string) || null;
  const seoTitle = (formData.get("seoTitle") as string) || null;
  const seoDescription = (formData.get("seoDescription") as string) || null;

  if (!title || !slug || !contentHtml) {
    throw new Error("Title, slug, and content are required");
  }

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

    await logAdminAudit({
      adminId: admin.id,
      action: "UPDATE_FREE_CONTENT",
      entityType: "FreeContent",
      entityId: id,
      details: { title, slug },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to update free content", error);
    throw new Error("Failed to update free content");
  }

  safeRevalidatePath("/admin/free-content");
  safeRedirect("/admin/free-content");
}

export async function deleteFreeContent(id: string) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Content ID is required");
  }

  try {
    await prisma.freeContent.delete({
      where: { id },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "DELETE_FREE_CONTENT",
      entityType: "FreeContent",
      entityId: id,
    });

    safeRevalidatePath("/admin/free-content");
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.startsWith("Forbidden")) {
      throw error;
    }
    console.error("Failed to delete free content", error);
    throw new Error("Failed to delete free content");
  }
}
