import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { TicketCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, subject, category, description } = body;

    if (!fullName || !email || !subject || !category || !description) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    // Try to associate with a logged-in user if they are authenticated
    let userId = null;
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true }
        });
        if (dbUser) {
          userId = dbUser.id;
        }
      }
    } catch (e) {
      // Ignore auth errors, allow guest submission
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        fullName,
        email,
        subject,
        category: category as TicketCategory,
        description,
        userId
      }
    });

    // Activity Tracking / Auditing
    await logger.info(`New support ticket created: ${ticket.ticketId}`, "SYSTEM", { ticketId: ticket.ticketId, email });

    revalidatePath("/admin/support");

    return NextResponse.json({ success: true, ticketId: ticket.ticketId }, { status: 201 });

  } catch (error: any) {
    logger.error("Contact Form Submission Error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
