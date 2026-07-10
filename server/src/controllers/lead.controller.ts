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
    const { name, email, source } = req.body;

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
      // Update source or name if provided
      const updateData: any = {};
      if (source && existingLead.source !== source) updateData.source = source;
      if (name && existingLead.name !== name) updateData.name = name;

      if (Object.keys(updateData).length > 0) {
        lead = await prisma.lead.update({
          where: { email },
          data: updateData,
        });
      }
    } else {
      lead = await prisma.lead.create({
        data: {
          name: name || null,
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
        "Your Hikarii Method Template Inside!",
        getLeadMagnetTemplate(email),
        emailOptions,
      );
      console.log(`Lead magnet sent successfully to: ${email}`);
    } catch (emailError) {
      console.error("Lead magnet email failed to send:", emailError);
    }

    res.status(201).json({
      message:
        "Success! You've been added to our interest list. Check your inbox for the Hikarii Method magnet!",
      lead,
    });
  } catch (error: any) {
    console.error("Lead capture error:", error);
    res.status(500).json({ error: error.message });
  }
};
