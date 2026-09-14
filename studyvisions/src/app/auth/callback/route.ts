import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.session?.user?.email) {
      // Find the user in Prisma to check their role
      const dbUser = await prisma.user.findUnique({
        where: { email: data.session.user.email },
      });

      // Redirect logic based on role
      if (dbUser && (dbUser.role === "ADMIN" || dbUser.role === "SUPER_ADMIN")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  // If there's an error or no code, redirect back to login
  return NextResponse.redirect(new URL("/auth/login?error=auth_failed", request.url));
}
