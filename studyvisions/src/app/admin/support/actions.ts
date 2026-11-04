"use server";

import prisma from "@/lib/prisma";
import { requireAdmin, logAdminAudit, safeRevalidatePath } from "@/lib/auth-utils";

export async function updateTicketStatus(ticketId: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error: any) {
    if (error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Permission denied" };
  }

  if (!ticketId) {
    return { error: "Ticket ID is required" };
  }

  const validStatuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid ticket status" };
  }

  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "UPDATE_TICKET_STATUS",
      entityType: "SupportTicket",
      entityId: ticketId,
      details: { status },
    });
    
    safeRevalidatePath("/admin/support");
    safeRevalidatePath(`/admin/support/${ticketId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    return { error: "Failed to update status" };
  }
}

export async function updateTicketPriority(ticketId: string, priority: "LOW" | "MEDIUM" | "HIGH") {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error: any) {
    if (error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Permission denied" };
  }

  if (!ticketId) {
    return { error: "Ticket ID is required" };
  }

  const validPriorities = ["LOW", "MEDIUM", "HIGH"];
  if (!validPriorities.includes(priority)) {
    return { error: "Invalid ticket priority" };
  }

  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { priority },
    });

    await logAdminAudit({
      adminId: admin.id,
      action: "UPDATE_TICKET_PRIORITY",
      entityType: "SupportTicket",
      entityId: ticketId,
      details: { priority },
    });
    
    safeRevalidatePath("/admin/support");
    safeRevalidatePath(`/admin/support/${ticketId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket priority:", error);
    return { error: "Failed to update priority" };
  }
}
