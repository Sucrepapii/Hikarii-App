import { Request, Response } from "express";
import prisma from "../config/db";
import { subDays } from "date-fns";
import bcrypt from "bcryptjs";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { name, email, password } = req.body;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true, // Auto-verify admins created by other admins
        requiresPasswordChange: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: "CREATE_ADMIN",
        targetId: newAdmin.id,
        targetType: "USER",
        details: { email, name },
        ipAddress: req.ip,
      },
    });

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Failed to create admin" });
  }
};

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
      select: { role: true, name: true },
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

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: "UPDATE_USER",
        targetId: id,
        targetType: "USER",
        details: { name, email, role, subscriptionStatus },
        ipAddress: req.ip,
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

    // Admins cannot delete themselves
    if (id === adminId) {
      return res
        .status(400)
        .json({ message: "Admins cannot delete their own account" });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: "DELETE_USER",
        targetId: id,
        targetType: "USER",
        details: { email: targetUser.email, name: targetUser.name },
        ipAddress: req.ip,
      },
    });

    res.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;
    const { reason, durationDays } = req.body;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const suspensionExpires = durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : null;

    await prisma.user.update({
      where: { id },
      data: {
        isSuspended: true,
        suspensionReason: reason,
        suspensionExpires: suspensionExpires,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: "SUSPEND_USER",
        targetId: id,
        targetType: "USER",
        details: { reason, durationDays, expires: suspensionExpires },
        ipAddress: req.ip,
      },
    });

    res.json({ message: "User suspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

export const reactivateUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { id } = req.params;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await prisma.user.update({
      where: { id },
      data: {
        isSuspended: false,
        suspensionReason: null,
        suspensionExpires: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: "REACTIVATE_USER",
        targetId: id,
        targetType: "USER",
        ipAddress: req.ip,
      },
    });

    res.json({ message: "User reactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reactivate user" });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: { name: true, email: true },
        },
      },
      take: 200,
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

export const handleBatchOperations = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { userIds, action, details } = req.body;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "No users selected" });
    }

    if (action === "DELETE") {
      // Prevent self-deletion in batch
      const filteredIds = userIds.filter((id) => id !== adminId);
      await prisma.user.deleteMany({
        where: { id: { in: filteredIds } },
      });
    } else if (action === "SUSPEND") {
      const { reason, durationDays } = details || {};
      const suspensionExpires = durationDays
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        : null;

      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          isSuspended: true,
          suspensionReason: reason,
          suspensionExpires: suspensionExpires,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        adminId,
        action: `BATCH_${action}`,
        details: { userCount: userIds.length, userIds, ...details },
        ipAddress: req.ip,
      },
    });

    res.json({ message: `Batch ${action} completed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Batch operation failed" });
  }
};
