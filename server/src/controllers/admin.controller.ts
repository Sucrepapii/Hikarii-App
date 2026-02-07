import { Request, Response } from "express";
import prisma from "../config/db";

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

    const [
      totalUsers,
      activeUsers,
      proUsers,
      totalTasks,
      totalAiSplits,
      totalExpenses,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({
        where: {
          role: "USER",
          lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.user.count({ where: { role: "USER", subscriptionStatus: "PRO" } }),
      prisma.task.count(),
      prisma.taskBlock.count(), // Using TaskBlock as proxy for AI splits if direct ref missing
      prisma.expense.count(),
    ]);

    // Grouping by engagement (Clarity, Focus, Freedom)
    const engagement = {
      clarity: await prisma.task.count({ where: { status: "TODO" } }),
      focus: await prisma.task.count({ where: { status: "IN_PROGRESS" } }),
      freedom: await prisma.task.count({ where: { status: "COMPLETED" } }),
    };

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        proUsers,
        totalTasks,
        totalAiSplits,
        totalExpenses,
        estimatedMRR: proUsers * 10, // Mock MRR
      },
      engagement,
      users: [], // Handled in management page
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
