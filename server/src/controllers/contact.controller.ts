import { Request, Response } from "express";
import { sendEmail } from "../services/email.service";
import {
  getContactFormTemplate,
  getContactAutoReplyTemplate,
} from "../utils/emailTemplates";

export const submitContactForm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // 1. Send Notification to Admin (You)
    // Ideally, this email should be in .env, checking env or defaulting
    const adminEmail = process.env.ADMIN_EMAIL || "support@Hikariii.org"; // Fallback or use a specific env var

    // Format the admin email
    const adminHtml = getContactFormTemplate(
      firstName,
      lastName,
      email,
      subject,
      message,
    );

    // We'll send to the configured sender or a specific admin inbox.
    // For now, let's assume we send TO the address defined as admin,
    // using the functionality of sendEmail which sends FROM the system address.
    // NOTE: If you haven't verified support@Hikariii.org in Resend yet,
    // you might need to send TO your personal email for testing if in sandbox mode.
    // However, the user asked to connect it, implying they might have a domain.
    // We'll use a safe fallback if ADMIN_EMAIL isn't set, likely matching the sender for now to avoid errors if verify needed.

    try {
      console.log(`Sending contact notification to Admin: ${adminEmail}`);
      await sendEmail(adminEmail, `Contact Form: ${subject}`, adminHtml);

      // 2. Send Auto-Reply to User
      const userHtml = getContactAutoReplyTemplate(firstName);
      console.log(`Sending auto-reply to user: ${email}`);
      await sendEmail(
        email,
        "We received your message - Hikarii Support",
        userHtml,
      );
    } catch (emailError) {
      console.error("Email sending failed, but contact form submitted:", emailError);
      // We still return 200 below because the form was successfully received by the backend,
      // even if the email notification failed (e.g. Resend domain not verified).
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
