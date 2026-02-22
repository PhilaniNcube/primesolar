// Users table is now managed by Better Auth.
// See ./auth-schema.ts for the user, session, account, and verification tables.
//
// Re-export for convenience so existing imports from "./users" still resolve.
export { user, session, account, verification } from "./auth-schema";

