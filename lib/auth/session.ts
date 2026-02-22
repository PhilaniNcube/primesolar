import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Helper to get the current session in RSC / server-actions.
 * Returns `null` when unauthenticated.
 */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Same as getSession but throws if no session exists.
 * Useful in server-actions that must be authenticated.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Require the user to have a specific role.
 */
export async function requireRole(role: string) {
  const session = await requireSession();
  if (session.user.role !== role) {
    throw new Error("Forbidden");
  }
  return session;
}
