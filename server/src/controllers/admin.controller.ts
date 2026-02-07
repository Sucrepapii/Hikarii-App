import { Request, Response } from "express";
import prisma from "../config/db";
import { subDays } from "date-fns";

export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;

    // Verify Admin Access
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    // --- Platform Health ---
    const totalUsers = await prisma.user.count({ where: { role: "USER" } });
    const proUsers = await prisma.user.count({
      where: { subscriptionStatus: "PRO", role: "USER" },
    });

    const sevenDaysAgo = subDays(new Date(), 7);
    const thirtyDaysAgo = subDays(new Date(), 30);

    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: { gte: sevenDaysAgo },
        role: "USER",
      },
    });

    const totalTasks = await prisma.task.count();
    // Proxy for "AI Splits": Counting TaskBlocks.
    const totalAiSplits = await prisma.taskBlock.count();
    const totalExpenses = await prisma.expense.count();

    // --- Method Engagement (Last 30 Days) ---
    const recentTasks = await prisma.task.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const recentSplits = await prisma.taskBlock.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const recentExpenses = await prisma.expense.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // --- Revenue Estimates ---
    const estimatedMRR = proUsers * 9.99;

    // Fetch Recent Users
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        proUsers,
        totalTasks,
        totalAiSplits,
        totalExpenses,
        estimatedMRR,
      },
      engagement: {
        clarity: recentTasks,
        focus: recentSplits,
        freedom: recentExpenses,
      },
      users,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch admin data" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const { name, email, role, subscriptionStatus } = req.body;

    // Verify Admin Access
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: (name as string) || undefined,
        email: (email as string) || undefined,
        role: (role as any) || undefined,
        subscriptionStatus: (subscriptionStatus as any) || undefined,
      },
    });

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;

    // Verify Admin Access
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admins cannot delete themselves via this endpoint (prevent lockout)
    if (targetUser.id === adminId) {
      return res
        .status(400)
        .json({ message: "Admins cannot delete their own account" });
    }

    // Delete user (Prisma onDelete: Cascade will handle linked records)
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
