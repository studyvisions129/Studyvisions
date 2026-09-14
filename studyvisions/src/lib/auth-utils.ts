import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email }
  });
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}
