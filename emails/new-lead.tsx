import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewLeadEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  configurationId?: string | null;
  submittedAt?: Date | string;
}

export function NewLeadEmail({
  firstName,
  lastName,
  email,
  phone,
  configurationId,
  submittedAt,
}: NewLeadEmailProps) {
  const adminUrl = `https://www.primesolar.co.za/admin/leads`;

  return (
    <Html>
      <Head />
      <Preview>
        New lead from {firstName} {lastName} — PrimeSolar
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>☀️ PrimeSolar</Heading>
            <Text style={headerBadge}>NEW LEAD</Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading as="h2" style={heading}>
              New Solar Quote Request
            </Heading>

            <Text style={paragraph}>
              A new lead has been submitted through the PrimeSolar website.
              Here are the details:
            </Text>

            {/* Lead Details Card */}
            <Section style={detailsCard}>
              <Text style={detailsTitle}>👤 Contact Information</Text>

              <Row style={detailRow}>
                <Column style={labelCol}>
                  <Text style={label}>Name</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={value}>
                    {firstName} {lastName}
                  </Text>
                </Column>
              </Row>

              <Hr style={detailHr} />

              <Row style={detailRow}>
                <Column style={labelCol}>
                  <Text style={label}>Email</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={value}>
                    <Link href={`mailto:${email}`} style={valueLink}>
                      {email}
                    </Link>
                  </Text>
                </Column>
              </Row>

              <Hr style={detailHr} />

              <Row style={detailRow}>
                <Column style={labelCol}>
                  <Text style={label}>Phone</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={value}>
                    {phone ? (
                      <Link href={`tel:${phone}`} style={valueLink}>
                        {phone}
                      </Link>
                    ) : (
                      <span style={notProvided}>Not provided</span>
                    )}
                  </Text>
                </Column>
              </Row>

              <Hr style={detailHr} />

              <Row style={detailRow}>
                <Column style={labelCol}>
                  <Text style={label}>Configuration</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={value}>{configurationId ?? "—"}</Text>
                </Column>
              </Row>

              <Hr style={detailHr} />

              <Row style={detailRow}>
                <Column style={labelCol}>
                  <Text style={label}>Submitted</Text>
                </Column>
                <Column style={valueCol}>
                  <Text style={value}>
                    {submittedAt
                      ? new Date(submittedAt).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Action */}
            <Section style={buttonContainer}>
              <Link href={adminUrl} style={button}>
                View in Admin Dashboard
              </Link>
            </Section>

            <Section style={tipBox}>
              <Text style={tipText}>
                💡 <strong>Tip:</strong> Respond within 1 hour to increase your
                conversion rate by up to 7x. Quick follow-ups make a huge
                difference!
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerText}>
              PrimeSolar — Solar Energy Solutions for South Africa
            </Text>
            <Text style={footerSubtext}>
              This is an automated notification from your PrimeSolar website.
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
  margin: "0 0 8px",
};

const headerBadge: React.CSSProperties = {
  backgroundColor: "#fbbf24",
  color: "#78350f",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  borderRadius: "4px",
  padding: "4px 12px",
  display: "inline-block",
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
  margin: "0 0 24px",
};

const detailsCard: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px",
  border: "1px solid #e5e7eb",
};

const detailsTitle: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "15px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const detailRow: React.CSSProperties = {
  margin: "0",
};

const labelCol: React.CSSProperties = {
  width: "140px",
  verticalAlign: "top" as const,
};

const valueCol: React.CSSProperties = {
  verticalAlign: "top" as const,
};

const label: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "8px 0",
};

const value: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "15px",
  fontWeight: "500",
  margin: "8px 0",
};

const valueLink: React.CSSProperties = {
  color: "#16a34a",
  textDecoration: "underline",
};

const notProvided: React.CSSProperties = {
  color: "#9ca3af",
  fontStyle: "italic" as const,
};

const detailHr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "4px 0",
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

const tipBox: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0",
  border: "1px solid #bfdbfe",
};

const tipText: React.CSSProperties = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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

export default NewLeadEmail;
