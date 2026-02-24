import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  options?: { fromName?: string; fromDomain?: string },
) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Skipping email: No RESEND_API_KEY provided.");
      return;
    }

    const resend = new Resend(apiKey);

    const defaultDomain = process.env.EMAIL_DOMAIN || "hikarii.org";
    const emailDomain = options?.fromDomain || defaultDomain;
    const fromName = options?.fromName || "Hikari";
    const fromEmail = `${fromName} <noreply@${emailDomain}>`;

    if (!process.env.EMAIL_DOMAIN && !options?.fromDomain) {
      console.log(
        "Using default email domain: hikarii.org (EMAIL_DOMAIN not set)",
      );
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
