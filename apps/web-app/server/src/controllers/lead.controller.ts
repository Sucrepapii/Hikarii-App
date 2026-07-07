import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendEmail } from "../services/email.service";
import { getLeadMagnetTemplate } from "../utils/emailTemplates";

export const createLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { email, source } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // Check if lead already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email },
    });

    let lead;
    if (existingLead) {
      lead = existingLead;
      // Update source if provided
      if (source && existingLead.source !== source) {
        lead = await prisma.lead.update({
          where: { email },
          data: { source },
        });
      }
    } else {
      lead = await prisma.lead.create({
        data: {
          email,
          source: source || "GENERAL_INTEREST",
        },
      });
    }

    // Trigger lead magnet email
    try {
      const emailOptions: any = {};
      if (source === "FOOTER_SIGNUP") {
        emailOptions.fromName = "Stay Focused";
        if (process.env.STAY_FOCUSED_EMAIL_DOMAIN) {
          emailOptions.fromDomain = process.env.STAY_FOCUSED_EMAIL_DOMAIN;
        }
      }

      console.log(
        `Attempting to send lead magnet to: ${email} (Source: ${source || "n/a"})`,
      );
      await sendEmail(
        email,
        "Your Hikari Method Template Inside!",
        getLeadMagnetTemplate(email),
        emailOptions,
      );
      console.log(`Lead magnet sent successfully to: ${email}`);
    } catch (emailError) {
      console.error("Lead magnet email failed to send:", emailError);
    }

    res.status(201).json({
      message:
        "Success! You've been added to our interest list. Check your inbox for the Hikari Method magnet!",
      lead,
    });
  } catch (error: any) {
    console.error("Lead capture error:", error);
    res.status(500).json({ error: error.message });
  }
};
