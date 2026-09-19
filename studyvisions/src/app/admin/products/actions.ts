"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductType, ProductStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-utils";

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string || null;
  const type = formData.get("type") as ProductType;
  const status = formData.get("status") as ProductStatus;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null;
  const academicLevelId = formData.get("academicLevelId") as string;
  const isFeatured = formData.get("isFeatured") === "on";
  
  // New studio fields
  const totalPages = formData.get("totalPages") ? parseInt(formData.get("totalPages") as string, 10) : null;
  const language = formData.get("language") as string || "Hindi";

  if (!title || !slug || !type || isNaN(price)) {
    throw new Error("Missing required fields");
  }

  await prisma.product.create({
    data: {
      title,
      slug,
      description,
      shortDescription,
      type,
      status,
      price,
      compareAtPrice,
      academicLevelId: academicLevelId || null,
      isFeatured,
      totalPages,
      language,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
}
