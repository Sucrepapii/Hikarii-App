import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.userId as string;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    res.json({ message: "Notification marked as read" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.userId as string;

    await prisma.notification.deleteMany({
      where: { id, userId },
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearAllNotifications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    await prisma.notification.deleteMany({
      where: { userId },
    });

    res.json({ message: "All notifications cleared successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


