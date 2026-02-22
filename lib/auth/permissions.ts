import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

/**
 * Define custom permission statements.
 * Merge with Better Auth's default admin statements so built-in
 * admin permissions (user CRUD, session management, etc.) are preserved.
 */
const statement = {
  ...defaultStatements,
  /** Custom resource: solar leads / quotes */
  lead: ["view", "create", "update", "delete"],
  /** Custom resource: product catalog (panels, batteries, inverters) */
  product: ["view", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Roles
 * ─────
 * admin  – full access to everything (inherits all default admin perms)
 * user   – public-facing users; can only view products & create leads
 */
export const admin = ac.newRole({
  lead: ["view", "create", "update", "delete"],
  product: ["view", "create", "update", "delete"],
  ...adminAc.statements, // inherit default admin permissions (user mgmt, sessions, etc.)
});

export const user = ac.newRole({
  lead: ["view", "create"],
  product: ["view"],
});
