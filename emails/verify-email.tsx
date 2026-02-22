import {
  Body,
  Button,
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

interface VerifyEmailProps {
  name: string;
  verifyUrl: string;
}

export function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for PrimeSolar</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>☀️ PrimeSolar</Heading>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading as="h2" style={heading}>
              Welcome to PrimeSolar!
            </Heading>

            <Text style={paragraph}>Hi {name},</Text>

            <Text style={paragraph}>
              Thanks for creating your PrimeSolar account! To get started,
              please verify your email address by clicking the button below:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verifyUrl}>
                Verify My Email
              </Button>
            </Section>

            <Section style={benefitsBox}>
              <Text style={benefitsTitle}>
                With your verified account you can:
              </Text>
              <Text style={benefitItem}>⚡ Get instant solar estimates</Text>
              <Text style={benefitItem}>📊 Compare panels, batteries &amp; inverters</Text>
              <Text style={benefitItem}>💰 Track your potential savings</Text>
              <Text style={benefitItem}>📋 Save and manage your quotes</Text>
            </Section>

            <Text style={mutedText}>
              If you didn&apos;t create an account with PrimeSolar, you can
              safely ignore this email.
            </Text>

            <Text style={mutedText}>
              If the button above doesn&apos;t work, copy and paste this URL
              into your browser:
            </Text>
            <Text style={linkText}>
              <Link href={verifyUrl} style={link}>
                {verifyUrl}
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

const benefitsBox: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "24px 0",
  border: "1px solid #bbf7d0",
};

const benefitsTitle: React.CSSProperties = {
  color: "#15803d",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const benefitItem: React.CSSProperties = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
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

export default VerifyEmail;
