import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Secure Data Deletion Lifecycle (Section I.2.2)
    // Here we perform Soft Delete & Anonymization (deactivate account)
    // Full hard deletion might be required by law in some regions, but usually financial records (orders) must be kept.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: false,
        email: `deleted_${user.id}@studyvisions.com`, // Pseudo-anonymization
        fullName: "Deleted User",
      }
    });

    // Log the audit event
    await logger.info(`User ${user.id} requested account deletion.`, "AUTH", { userId: user.id });

    // Sign out from Supabase
    await supabase.auth.signOut();

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    logger.error("Account Deletion Error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
