import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ForgotPasswordEmail({
  name,
  resetUrl,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        We received your password reset request — PrimeSolar
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>☀️ PrimeSolar</Heading>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading as="h2" style={heading}>
              Forgot Your Password?
            </Heading>

            <Text style={paragraph}>Hi {name},</Text>

            <Text style={paragraph}>
              No worries — it happens to the best of us! We received a request
              to reset the password associated with your PrimeSolar account.
            </Text>

            <Section style={stepsBox}>
              <Text style={stepsTitle}>Here&apos;s what to do next:</Text>
              <Text style={stepItem}>
                <span style={stepNumber}>1</span> Click the secure link below
              </Text>
              <Text style={stepItem}>
                <span style={stepNumber}>2</span> Choose a new password (min. 8
                characters)
              </Text>
              <Text style={stepItem}>
                <span style={stepNumber}>3</span> Sign in with your new password
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Link href={resetUrl} style={button}>
                Reset My Password
              </Link>
            </Section>

            <Section style={warningBox}>
              <Text style={warningText}>
                🕐 This link expires in <strong>1 hour</strong> for security
                reasons. If it expires, you can request a new one from the sign-in page.
              </Text>
            </Section>

            <Text style={mutedText}>
              If you didn&apos;t request this, your account is still secure — no
              changes have been made. You can safely ignore this email.
            </Text>

            <Text style={mutedText}>
              Having trouble with the button? Copy and paste this URL:
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
              Need help?{" "}
              <Link href="mailto:dev@primesolar.co.za" style={footerLink}>
                Contact Support
              </Link>
            </Text>
            <Text style={footerSubtext}>
              © {new Date().getFullYear()} PrimeSolar. All rights reserved.
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

const stepsBox: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "24px 0",
  border: "1px solid #e5e7eb",
};

const stepsTitle: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "15px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const stepItem: React.CSSProperties = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 10px",
  display: "flex" as const,
  alignItems: "center" as const,
};

const stepNumber: React.CSSProperties = {
  backgroundColor: "#16a34a",
  color: "#ffffff",
  borderRadius: "50%",
  width: "22px",
  height: "22px",
  display: "inline-flex",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  fontSize: "12px",
  fontWeight: "700",
  marginRight: "10px",
  flexShrink: 0,
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

const warningBox: React.CSSProperties = {
  backgroundColor: "#fffbeb",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "24px 0",
  border: "1px solid #fde68a",
};

const warningText: React.CSSProperties = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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

export default ForgotPasswordEmail;
