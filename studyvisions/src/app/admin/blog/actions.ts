"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

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

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      isPublished,
      authorId: user.id
    },
  });

  revalidatePath("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  
  await prisma.post.delete({
    where: { id }
  });
  revalidatePath("/admin/blog");
}
