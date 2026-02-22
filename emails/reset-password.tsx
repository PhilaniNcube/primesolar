import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your PrimeSolar password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>☀️ PrimeSolar</Heading>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading as="h2" style={heading}>
              Password Reset Request
            </Heading>

            <Text style={paragraph}>Hi {name},</Text>

            <Text style={paragraph}>
              We received a request to reset your password for your PrimeSolar
              account. Click the button below to choose a new password:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset My Password
              </Button>
            </Section>

            <Text style={mutedText}>
              This link will expire in <strong>1 hour</strong>. If you didn&apos;t
              request a password reset, you can safely ignore this email — your
              password will remain unchanged.
            </Text>

            <Text style={mutedText}>
              If the button above doesn&apos;t work, copy and paste this URL into
              your browser:
            </Text>
            <Text style={linkText}>
              <Link href={resetUrl} style={link}>
                {resetUrl}
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerText}>
              PrimeSolar — Solar Energy Solutions for South Africa
            </Text>
            <Text style={footerSubtext}>
              © {new Date().getFullYear()} PrimeSolar. All rights reserved.
            </Text>
            <Text style={footerSubtext}>
              <Link href="https://www.primesolar.co.za" style={footerLink}>
                www.primesolar.co.za
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──────────────────────────────────────────────────
const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const headerSection: React.CSSProperties = {
  backgroundColor: "#15803d",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const contentSection: React.CSSProperties = {
  padding: "40px",
};

const heading: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 20px",
};

const paragraph: React.CSSProperties = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#16a34a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "14px 32px",
  display: "inline-block",
};

const mutedText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px",
};

const linkText: React.CSSProperties = {
  margin: "0 0 16px",
};

const link: React.CSSProperties = {
  color: "#16a34a",
  fontSize: "13px",
  wordBreak: "break-all" as const,
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footerSection: React.CSSProperties = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "13px",
  margin: "0 0 4px",
  fontWeight: "600",
};

const footerSubtext: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0 0 4px",
};

const footerLink: React.CSSProperties = {
  color: "#16a34a",
  textDecoration: "underline",
};

export default ResetPasswordEmail;
