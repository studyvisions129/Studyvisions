"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(ticketId: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
    return { error: "Permission denied" };
  }

  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
    
    revalidatePath("/admin/support");
    revalidatePath(`/admin/support/${ticketId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    return { error: "Failed to update status" };
  }
}

export async function updateTicketPriority(ticketId: string, priority: "LOW" | "MEDIUM" | "HIGH") {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) return { error: "Unauthorized" };

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
    return { error: "Permission denied" };
  }

  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { priority },
    });
    
    revalidatePath("/admin/support");
    revalidatePath(`/admin/support/${ticketId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket priority:", error);
    return { error: "Failed to update priority" };
  }
}
