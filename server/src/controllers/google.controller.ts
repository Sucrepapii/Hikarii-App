import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  exchangeCodeForToken,
  createCalendarEvent,
} from "../services/google.calendar.service";
import prisma from "../config/db";

export const connectGoogle = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ error: "Authorization code required" });
      return;
    }

    const user = await exchangeCodeForToken(req.userId as string, code as string);

    res.json({
      success: true,
      message: "Google Calendar connected successfully",
      isConnected: !!user.googleAccessToken,
    });
  } catch (error: any) {
    console.error("Google Connect Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const syncTaskToCalendar = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { taskId } = req.body;

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: req.userId },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const event = await createCalendarEvent(req.userId as string, task);

    if (!event) {
      res
        .status(400)
        .json({ error: "Failed to create event or user not connected" });
      return;
    }

    res.json({
      success: true,
      message: "Task synced to Google Calendar",
      eventId: event.id,
      link: event.htmlLink,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const disconnectGoogle = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleId: null,
      },
    });
    res.json({ success: true, message: "Disconnected from Google Calendar" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGoogleStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { googleAccessToken: true },
    });

    res.json({ isConnected: !!user?.googleAccessToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
