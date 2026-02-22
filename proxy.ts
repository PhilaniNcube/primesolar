import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 "proxy" – replaces middleware.
 *
 * Uses a lightweight cookie-existence check (no DB call) to
 * optimistically redirect unauthenticated users away from
 * protected routes.  Actual session validation happens in each
 * page / server-action via `auth.api.getSession`.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // protect all admin routes
};
