import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const body = await req.json();
    const { eventName, category, productId, metadata } = body;

    if (!eventName || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let userId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      if (user) {
        userId = user.id;
      }
    }

    // Extract device/platform if available from user-agent or headers
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    // Asynchronous event tracking - we don't wait for DB insert to return OK
    // But since it's serverless we await it to ensure it runs before lambda dies
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        category,
        userId,
        productId,
        platform: userAgent.substring(0, 100), // simplistic platform logging
        metadata: metadata ? (typeof metadata === 'object' ? metadata : { raw: metadata }) : undefined,
      }
    });

    return NextResponse.json({ status: "tracked" }, { status: 200 });
  } catch (error) {
    console.error("Analytics Tracking Error:", error);
    // Silent fail for analytics so we don't block workflow
    return NextResponse.json({ status: "error", message: "silent failure" }, { status: 200 });
  }
}
