import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  // Ensure this is called only by a trusted CRON service via a secret
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Retention Policy: Clear old System Logs (older than 30 days)
    const logsDeletion = await prisma.systemLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // 2. Clear old Analytics Events (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const analyticsDeletion = await prisma.analyticsEvent.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    await logger.info(`Cron Data Retention executed. Deleted ${logsDeletion.count} logs and ${analyticsDeletion.count} analytics events.`, "SYSTEM");

    return NextResponse.json({ 
      success: true, 
      logsDeleted: logsDeletion.count,
      analyticsDeleted: analyticsDeletion.count
    }, { status: 200 });

  } catch (error: any) {
    logger.error("Data Retention Cron Error", { message: error.message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
