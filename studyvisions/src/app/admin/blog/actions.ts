"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function createPost(formData: FormData) {
  const user = await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      isPublished,
      authorId: user.id
    },
  });

  await logAdminAudit({
    adminId: user.id,
    action: "CREATE_POST",
    entityType: "Post",
    entityId: post.id,
    details: { title, slug },
  });

  safeRevalidatePath("/admin/blog");
}

export async function deletePost(id: string) {
  const admin = await requireAdmin();

  if (!id) {
    throw new Error("Post ID is required");
  }
  
  await prisma.post.delete({
    where: { id }
  });

  await logAdminAudit({
    adminId: admin.id,
    action: "DELETE_POST",
    entityType: "Post",
    entityId: id,
  });

  safeRevalidatePath("/admin/blog");
}
