import { Resend } from "resend";
import { render } from "@react-email/components";
import type { ReactElement } from "react";

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Default "from" address for transactional emails.
 */
export const EMAIL_FROM = "PrimeSolar <dev@primesolar.co.za>";

/** Notification recipient for internal alerts (new leads, etc.) */
export const ADMIN_EMAIL = "dev@primesolar.co.za";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendReactEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

/**
 * Send an email using a React Email component.
 * Renders the component to HTML automatically.
 */
export async function sendReactEmail({
  to,
  subject,
  react,
}: SendReactEmailOptions) {
  const html = await render(react);
  const text = await render(react, { plainText: true });
  return sendEmail({ to, subject, html, text });
}
