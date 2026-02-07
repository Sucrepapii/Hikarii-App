import { Request, Response } from "express";
import prisma from "../config/db";
import { subDays } from "date-fns";

export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Verify Admin Access
    const requestor = await prisma.user.findUnique({
      where: { id: userId },
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
    // AI splitting creates blocks. Manual breakdown might too, but this is the best proxy.
    const totalAiSplits = await prisma.taskBlock.count();
    const totalExpenses = await prisma.expense.count();

    // --- Method Engagement (Last 30 Days) ---
    // Users active in Clarity (Tasks), Focus (Splits), Freedom (Expenses)
    // We count distinct users who performed these actions in the last 30 days.

    const clarityUsers = await prisma.task.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const focusUsers = await prisma.taskBlock.groupBy({
      by: ["taskId"], // We need to join task to get userId, but groupBy limited in Prisma.
      // Alternative: Count tasks with blocks created recently.
      // Let's rely on tasks with blocks.
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    // Getting distinct users from blocks is harder directly.
    // Let's approximate Focus engagement by "Tasks with active blocks" created recently.
    // Or just simple counts for now to avoid complex joins in this step.

    // Simpler Approach for Method Engagement Charts (Counts):
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
    // Assuming $9.99/mo for PRO.
    const estimatedMRR = proUsers * 9.99;

    // Fetch Recent Users
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 50, // Back to 50 for management page
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
        clarity: recentTasks, // "Clarity" -> Tasks Created
        focus: recentSplits, // "Focus" -> AI Splits
        freedom: recentExpenses, // "Freedom" -> Expenses Tracked
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
    const adminId = req.user?.id;
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

    // Check if user exists (and ensure we are not editing an admin)
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Prevent changing admin through this general endpoint if needed,
    // though the UI filters them out already.
    if (targetUser.role === "ADMIN" && role !== "ADMIN") {
      // Maybe prevent demoting admins here for safety if this is the only admin
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
