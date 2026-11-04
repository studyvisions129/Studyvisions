import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Safe cache revalidation helper that works both in Next.js request context and test runners
export function safeRevalidatePath(path: string, type?: "layout" | "page") {
  try {
    revalidatePath(path, type);
  } catch {
    // Ignore static generation store missing errors when outside active Next.js request scope
  }
}

// Safe redirect helper that works in Next.js and doesn't abort test runners
export function safeRedirect(url: string) {
  try {
    redirect(url);
  } catch (error: any) {
    if (process.env.NODE_ENV === "test" && (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT"))) {
      return;
    }
    throw error;
  }
}

// Isolated test hook for automated security testing suites
export function __setTestSessionUser(user: { email: string } | null) {
  if (process.env.NODE_ENV !== "production") {
    (globalThis as any).__testSessionUser = user;
  }
}

export async function getAuthenticatedUserEmail(): Promise<string | null> {
  if (process.env.NODE_ENV !== "production" && (globalThis as any).__testSessionUser) {
    return (globalThis as any).__testSessionUser.email;
  }

  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.email || null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const email = await getAuthenticatedUserEmail();
  
  if (!email) {
    throw new Error("Unauthorized");
  }
  
  const user = await prisma.user.findUnique({ 
    where: { email }
  });
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

export async function requireSuperAdmin() {
  const email = await getAuthenticatedUserEmail();
  
  if (!email) {
    throw new Error("Unauthorized");
  }
  
  const user = await prisma.user.findUnique({ 
    where: { email }
  });
  
  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: Super Admin access required");
  }

  return user;
}

export async function logAdminAudit({
  adminId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: {
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        details: details ? (typeof details === "object" ? details : { raw: details }) : undefined,
        ipAddress: ipAddress || null,
      }
    });
  } catch (error) {
    console.error("Failed to write admin audit log:", error);
  }
}
