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

    if (existingLead) {
      // Update source if provided, or just return success
      if (source && existingLead.source !== source) {
        await prisma.lead.update({
          where: { email },
          data: { source },
        });
      }
      res.status(200).json({
        message:
          "Thank you for your interest! We already have your email on file.",
      });
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        email,
        source: source || "GENERAL_INTEREST",
      },
    });

    // Trigger lead magnet email
    try {
      await sendEmail(
        email,
        "Your Hikari Method Template Inside!",
        getLeadMagnetTemplate(email),
      );
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
