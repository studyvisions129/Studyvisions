"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) throw new Error("User not found");

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
  await prisma.post.delete({
    where: { id }
  });
  revalidatePath("/admin/blog");
}
