import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

/**
 * Next.js 16 "proxy" – replaces middleware.
 *
 * Validates the session cookie and checks the user's role before
 * allowing access to admin routes. This keeps the admin layout
 * fully static / prerenderable.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // No cookie at all → sign in
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Full session validation (DB call) + role check
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // protect all admin routes
};
