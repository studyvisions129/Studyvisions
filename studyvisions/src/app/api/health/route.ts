import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const healthStatus: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
    }
  };

  try {
    // Check DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = "healthy";
  } catch (error) {
    healthStatus.status = "unhealthy";
    healthStatus.services.database = "unhealthy";
    
    return NextResponse.json(healthStatus, { status: 503 });
  }

  return NextResponse.json(healthStatus, { status: 200 });
}
