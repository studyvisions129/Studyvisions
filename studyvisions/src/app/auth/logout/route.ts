import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Get the origin for absolute redirect
  const requestUrl = new URL(request.url);
  const loginUrl = new URL('/auth/login', requestUrl.origin);
  
  return NextResponse.redirect(loginUrl, {
    status: 303, // See Other (forces a GET request to the redirect URL)
  });
}
