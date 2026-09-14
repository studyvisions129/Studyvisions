"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function updateUserRole(userId: string, newRole: "STUDENT" | "ADMIN" | "SUPER_ADMIN") {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Check if the current user is a SUPER_ADMIN
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return { error: "Only Super Admins can change roles." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating role:", error);
    return { error: "Failed to update role. Please try again." };
  }
}
