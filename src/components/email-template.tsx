import * as React from "react";

interface EmailTemplateProps {
  first_name: string;
  last_name: string;
  email: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  first_name,
  last_name,
  email,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h1 style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
      Contact Form Submission
    </h1>
    <p>
      You have received a new contact form submission from{" "}
      <strong>
        {first_name} {last_name}
      </strong>
      .
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
  </div>
);
