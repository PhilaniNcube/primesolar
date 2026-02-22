import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createElement } from "react";
import { db } from "@/db";
import { ac, admin, user } from "./permissions";
import { sendReactEmail } from "@/lib/email";
import { ForgotPasswordEmail } from "@/emails/forgot-password";
import { VerifyEmail } from "@/emails/verify-email";

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
    sendResetPassword: async ({ user: u, url }) => {
      void sendReactEmail({
        to: u.email,
        subject: "Reset your password – PrimeSolar",
        react: createElement(ForgotPasswordEmail, {
          name: u.name,
          resetUrl: url,
        }),
      });
    },
  },

  /* ── Email Verification ────────────────────────────────── */
  emailVerification: {
    sendVerificationEmail: async ({ user: u, url }) => {
      void sendReactEmail({
        to: u.email,
        subject: "Verify your email – PrimeSolar",
        react: createElement(VerifyEmail, {
          name: u.name,
          verifyUrl: url,
        }),
      });
    },
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
      adminUserIds: ["QhiMXNzLuBGf8TrnQgmdA0BxTwle0Cko"],
    }),
    nextCookies(), // must be last – auto-sets cookies in server actions
  ],
});

export type Session = typeof auth.$Infer.Session;
