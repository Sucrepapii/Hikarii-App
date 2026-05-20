import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// Get current user metadata
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        phoneNumber: user.phoneNumber,
        waTasksEnabled: user.waTasksEnabled,
        waBudgetEnabled: user.waBudgetEnabled,
        waProjectsEnabled: user.waProjectsEnabled,
        requiresPasswordChange: user.requiresPasswordChange,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Profile (Name, Phone number, and Whatsapp notification settings)
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      phoneNumber,
      waTasksEnabled,
      waBudgetEnabled,
      waProjectsEnabled,
    } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;
    if (waTasksEnabled !== undefined) data.waTasksEnabled = waTasksEnabled;
    if (waBudgetEnabled !== undefined) data.waBudgetEnabled = waBudgetEnabled;
    if (waProjectsEnabled !== undefined)
      data.waProjectsEnabled = waProjectsEnabled;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        phoneNumber: user.phoneNumber,
        waTasksEnabled: user.waTasksEnabled,
        waBudgetEnabled: user.waBudgetEnabled,
        waProjectsEnabled: user.waProjectsEnabled,
        requiresPasswordChange: user.requiresPasswordChange,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Debug Environment Info
export const debugInfo = async (_req: any, res: Response) => {
  res.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
      CLIENT_URL: process.env.CLIENT_URL,
    },
    dbStatus: "connected",
  });
};
