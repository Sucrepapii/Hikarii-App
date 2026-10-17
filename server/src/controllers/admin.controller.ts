import { Request, Response } from "express";
import prisma from "../config/db";
import { subDays } from "date-fns";
import bcrypt from "bcryptjs";
import logger from "../config/logger";
import AdminService from "../services/admin.service";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const { name, email, password } = req.body;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      logger.warn({ adminId }, "Unauthorized admin creation attempt");
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
        isVerified: true,
        requiresPasswordChange: true,
      },
    });

    await AdminService.recordAuditLog({
      adminId,
      action: "CREATE_ADMIN",
      targetId: newAdmin.id,
      targetType: "USER",
      details: { email, name },
      ipAddress: req.ip,
    });

    // Send Onboarding Email via AdminService
    await AdminService.sendAdminOnboardingEmail(name, email, password);

    logger.info({ adminId, newAdminId: newAdmin.id, email }, "Admin created successfully");

    return res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, "Create Admin Error");
    return res.status(500).json({ message: "Failed to create admin" });
  }
};

export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      logger.warn({ adminId }, "Unauthorized admin dashboard access attempt");
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    // --- Platform Health ---
    const totalUsers = await prisma.user.count();
    const proUsers = await prisma.user.count({
      where: { subscriptionStatus: "PRO" },
    });

    const sevenDaysAgo = subDays(new Date(), 7);
    const thirtyDaysAgo = subDays(new Date(), 30);

    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: { gte: sevenDaysAgo },
      },
    });

    const totalTasks = await prisma.task.count();
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        createdAt: true,
        lastLoginAt: true,
        isSuspended: true,
        _count: {
          select: {
            tasks: true,
            expenses: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return res.json({
      health: {
        totalUsers,
        activeUsers,
        proUsers,
        totalTasks,
        totalAiSplits,
        totalExpenses,
      },
      engagement: {
        recentTasks,
        recentSplits,
        recentExpenses,
      },
      revenue: {
        estimatedMRR,
      },
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, "Get Admin Dashboard Data Error");
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const id = req.params.id as string;
    const { name, email, role, subscriptionStatus } = req.body;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true, name: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      logger.warn({ adminId }, "Unauthorized update user attempt");
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

    await AdminService.recordAuditLog({
      adminId,
      action: "UPDATE_USER",
      targetId: id,
      targetType: "USER",
      details: { name, email, role, subscriptionStatus },
      ipAddress: req.ip,
    });

    logger.info({ adminId, targetUserId: id }, "User updated by admin");

    return res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, "Update User Error");
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const id = req.params.id as string;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });

    await AdminService.recordAuditLog({
      adminId,
      action: "DELETE_USER",
      targetId: id,
      targetType: "USER",
      details: { email: targetUser.email, name: targetUser.name },
      ipAddress: req.ip,
    });

    logger.info({ adminId, targetUserId: id }, "User deleted by admin");

    return res.json({ message: "User and all associated data deleted successfully" });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, "Delete User Error");
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const id = req.params.id as string;
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

    const userToSuspend = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: true,
        suspensionReason: reason,
        suspensionExpires: suspensionExpires,
      },
    });

    await AdminService.sendSuspensionNotification(
      userToSuspend.name,
      userToSuspend.email,
      reason,
      suspensionExpires
    );

    await AdminService.recordAuditLog({
      adminId,
      action: "SUSPEND_USER",
      targetId: id,
      targetType: "USER",
      details: { reason, durationDays, expires: suspensionExpires },
      ipAddress: req.ip,
    });

    logger.info({ adminId, targetUserId: id, reason }, "User suspended by admin");

    return res.json({ message: "User suspended successfully" });
  } catch (error: any) {
    logger.error({ error: error.message }, "Suspend User Error");
    return res.status(500).json({ message: "Failed to suspend user" });
  }
};

export const reactivateUser = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const id = req.params.id as string;

    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const reactivatedUser = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: false,
        suspensionReason: null,
        suspensionExpires: null,
      },
    });

    await AdminService.sendReactivationNotification(
      reactivatedUser.name,
      reactivatedUser.email
    );

    await AdminService.recordAuditLog({
      adminId,
      action: "REACTIVATE_USER",
      targetId: id,
      targetType: "USER",
      ipAddress: req.ip,
    });

    logger.info({ adminId, targetUserId: id }, "User reactivated by admin");

    return res.json({ message: "User reactivated successfully" });
  } catch (error: any) {
    logger.error({ error: error.message }, "Reactivate User Error");
    return res.status(500).json({ message: "Failed to reactivate user" });
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { name: true, email: true },
          },
        },
        skip,
        take: limit,
      }),
      prisma.auditLog.count(),
    ]);

    return res.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message }, "Get Audit Logs Error");
    return res.status(500).json({ message: "Failed to fetch audit logs" });
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

    await AdminService.recordAuditLog({
      adminId,
      action: `BATCH_${action}`,
      targetId: "BATCH",
      targetType: "USERS",
      details: { userCount: userIds.length, userIds, ...details },
      ipAddress: req.ip,
    });

    logger.info({ adminId, action, count: userIds.length }, "Batch admin operation completed");

    return res.json({ message: `Batch ${action} completed successfully` });
  } catch (error: any) {
    logger.error({ error: error.message }, "Batch Operations Error");
    return res.status(500).json({ message: "Batch operation failed" });
  }
};

export const getMarketingStats = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const totalLeads = await prisma.lead.count();
    const recentLeads = await prisma.lead.count({
      where: { createdAt: { gte: subDays(new Date(), 7) } },
    });

    const articleStats = await prisma.articleFeedback.groupBy({
      by: ["articleSlug", "isHelpful"],
      _count: {
        id: true,
      },
    });

    const leadSources = await prisma.lead.groupBy({
      by: ["source"],
      _count: {
        id: true,
      },
    });

    const recentFeedback = await prisma.articleFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return res.json({
      leads: {
        total: totalLeads,
        last7Days: recentLeads,
        sources: leadSources,
      },
      contentPerformance: articleStats,
      recentFeedback,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, "Marketing Stats Error");
    return res.status(500).json({ message: "Failed to fetch marketing stats" });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).userId;
    const requestor = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const id = req.params.id as string;

    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      const articleFeedback = await prisma.articleFeedback.findUnique({ where: { id } });
      if (articleFeedback) {
        await prisma.articleFeedback.delete({ where: { id } });
        return res.json({ message: "Article feedback deleted successfully" });
      }
      return res.status(404).json({ message: "Feedback not found" });
    }

    await prisma.feedback.delete({ where: { id } });

    logger.info({ adminId, feedbackId: id }, "Feedback deleted by admin");

    return res.json({ message: "Feedback deleted successfully" });
  } catch (error: any) {
    logger.error({ error: error.message }, "Delete Feedback Error");
    return res.status(500).json({ message: "Failed to delete feedback" });
  }
};
