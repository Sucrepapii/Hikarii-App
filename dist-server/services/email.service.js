import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async (to, subject, html) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("Skipping email: No RESEND_API_KEY provided.");
      return;
    }
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Hikari<onboarding@resend.dev>",
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
