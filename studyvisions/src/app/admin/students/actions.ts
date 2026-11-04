"use server";

import prisma from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function updateUserRole(userId: string, newRole: "STUDENT" | "ADMIN" | "SUPER_ADMIN") {
  let superAdmin;
  try {
    superAdmin = await requireSuperAdmin();
  } catch (error: any) {
    if (error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Only Super Admins can change roles." };
  }

  if (!userId) {
    return { error: "User ID is required" };
  }

  const validRoles = ["STUDENT", "ADMIN", "SUPER_ADMIN"];
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role specified" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await logAdminAudit({
      adminId: superAdmin.id,
      action: "UPDATE_USER_ROLE",
      entityType: "User",
      entityId: userId,
      details: { newRole },
    });
    
    safeRevalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating role:", error);
    return { error: "Failed to update role. Please try again." };
  }
}

export async function sendNotification(userId: string, title: string, message: string) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error: any) {
    if (error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Permission denied" };
  }

  if (!userId || !title || !message) {
    return { error: "User ID, title, and message are required" };
  }

  try {
    const notif = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      }
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "SEND_NOTIFICATION",
      entityType: "Notification",
      entityId: notif.id,
      details: { targetUserId: userId, title },
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { error: "Failed to send notification" };
  }
}
