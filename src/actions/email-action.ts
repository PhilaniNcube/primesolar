"use server";

import { EmailTemplate } from "@/components/email-template";
import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAction(prevState:unknown, formData:FormData) {

  const email = formData.get("email") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  if(!email || !first_name || !last_name) {
     return {
       status: 500,
       message: "Error sending email, missing required fields",
     };
  }

  try {

    const {data, error} = await resend.emails.send({
      from: "Primesolar <dev@primesolar.co.za>",
      to: ['dev@primesolar.co.za'],
      bcc: ['ncbphi001@gmail.com'],
      subject: "Contact Form Submission",
      react: EmailTemplate({first_name, last_name, email})
    })

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    console.log(data);

    return {
      status: 200,
      message: "Email sent successfully",
    };

  } catch (error) {

    return {
      status: 500,
      message: "Error sending email",
    };

  }


}
