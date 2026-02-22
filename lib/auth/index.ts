import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { ac, admin, user } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://primesolar.co.za",
    "https://www.primesolar.co.za",
    process.env.BETTER_AUTH_URL!,
  ],

  /* ── Email & Password ──────────────────────────────────── */
  emailAndPassword: {
    enabled: true,
    // Uncomment & implement when you're ready for password-reset emails:
    // sendResetPassword: async ({ user, url, token }, request) => { ... },
  },

  /* ── Plugins ───────────────────────────────────────────── */
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
      defaultRole: "user",
    }),
    nextCookies(), // must be last – auto-sets cookies in server actions
  ],
});

export type Session = typeof auth.$Infer.Session;
