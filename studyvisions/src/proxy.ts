import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

import { NextResponse } from "next/server";

// Simple in-memory rate limit tracking (Note: this is per-isolate in serverless, so it's a soft limit)
const rateLimit = new Map();

export async function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  // Basic rate limiting for auth endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth") || request.nextUrl.pathname.startsWith("/auth")) {
    const current = rateLimit.get(ip) || { count: 0, startTime: Date.now() };
    
    // Reset every minute
    if (Date.now() - current.startTime > 60000) {
      current.count = 1;
      current.startTime = Date.now();
    } else {
      current.count++;
    }
    
    rateLimit.set(ip, current);

    // Max 30 requests per minute to auth
    if (current.count > 30) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  const response = await updateSession(request);
  
  // Enforce HTTPS everywhere (I.1.1 Security Standards)
  if (process.env.NODE_ENV === "production" && !request.headers.get("x-forwarded-proto")?.includes("https")) {
     // Usually handled by Vercel, but good to strictly enforce via header
     response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
