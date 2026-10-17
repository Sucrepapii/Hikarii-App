import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { createAdmin, getAdminDashboardData, updateUser } from "../admin.controller";
import prisma from "../../config/db";
import bcrypt from "bcryptjs";
import AdminService from "../../services/admin.service";

// Mock dependencies
vi.mock("../../config/db", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    task: {
      count: vi.fn(),
    },
    taskBlock: {
      count: vi.fn(),
    },
    expense: {
      count: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password_xyz"),
  },
}));

vi.mock("../../services/admin.service", () => ({
  default: {
    recordAuditLog: vi.fn().mockResolvedValue({ id: "audit-1" }),
    sendAdminOnboardingEmail: vi.fn().mockResolvedValue(true),
    sendSuspensionNotification: vi.fn().mockResolvedValue(true),
    sendReactivationNotification: vi.fn().mockResolvedValue(true),
  },
}));

function mockResponse(): Response {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("Admin Controller Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createAdmin", () => {
    it("should reject creation if requestor is not an admin", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "USER" });

      const req = {
        userId: "non-admin-id",
        body: { name: "New Admin", email: "new@hikarii.org", password: "SecretPassword123!" },
        ip: "127.0.0.1",
      } as unknown as Request;
      const res = mockResponse();

      await createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/Access Denied/i) })
      );
    });

    it("should return 400 when required fields are missing", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "ADMIN" });

      const req = {
        userId: "admin-id",
        body: { name: "Incomplete", email: "" },
      } as unknown as Request;
      const res = mockResponse();

      await createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "All fields are required" })
      );
    });

    it("should return 400 if user email already exists", async () => {
      (prisma.user.findUnique as any)
        .mockResolvedValueOnce({ role: "ADMIN" }) // Requestor check
        .mockResolvedValueOnce({ id: "existing-user-id" }); // Existing check

      const req = {
        userId: "admin-id",
        body: { name: "Existing", email: "existing@hikarii.org", password: "Password123!" },
      } as unknown as Request;
      const res = mockResponse();

      await createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User already exists" })
      );
    });

    it("should successfully create a new admin with hashed password and audit log", async () => {
      (prisma.user.findUnique as any)
        .mockResolvedValueOnce({ role: "ADMIN" }) // Requestor check
        .mockResolvedValueOnce(null); // No collision

      const createdUser = {
        id: "new-admin-123",
        name: "Super Admin",
        email: "super@hikarii.org",
        role: "ADMIN",
      };
      (prisma.user.create as any).mockResolvedValue(createdUser);

      const req = {
        userId: "admin-id",
        body: { name: "Super Admin", email: "super@hikarii.org", password: "ValidPassword123!" },
        ip: "127.0.0.1",
      } as unknown as Request;
      const res = mockResponse();

      await createAdmin(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("ValidPassword123!", 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(AdminService.recordAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: "admin-id",
          action: "CREATE_ADMIN",
          targetId: "new-admin-123",
        })
      );
      expect(AdminService.sendAdminOnboardingEmail).toHaveBeenCalledWith(
        "Super Admin",
        "super@hikarii.org",
        "ValidPassword123!"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Admin created successfully",
          user: expect.objectContaining({ id: "new-admin-123", email: "super@hikarii.org" }),
        })
      );
    });
  });

  describe("getAdminDashboardData", () => {
    it("should return 403 if requester is not admin", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "USER" });

      const req = { userId: "user-id", query: {} } as unknown as Request;
      const res = mockResponse();

      await getAdminDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return comprehensive dashboard metrics for admin", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "ADMIN" });
      (prisma.user.count as any)
        .mockResolvedValueOnce(50) // totalUsers
        .mockResolvedValueOnce(10) // proUsers
        .mockResolvedValueOnce(25); // activeUsers

      (prisma.task.count as any)
        .mockResolvedValueOnce(200) // totalTasks
        .mockResolvedValueOnce(45); // recentTasks

      (prisma.taskBlock.count as any)
        .mockResolvedValueOnce(350) // totalAiSplits
        .mockResolvedValueOnce(60); // recentSplits

      (prisma.expense.count as any)
        .mockResolvedValueOnce(120) // totalExpenses
        .mockResolvedValueOnce(30); // recentExpenses

      const sampleUsers = [
        { id: "u-1", name: "User One", email: "one@test.com", role: "USER" },
      ];
      (prisma.user.findMany as any).mockResolvedValue(sampleUsers);

      const req = {
        userId: "admin-id",
        query: { page: "1", limit: "10" },
      } as unknown as Request;
      const res = mockResponse();

      await getAdminDashboardData(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          health: expect.objectContaining({
            totalUsers: 50,
            proUsers: 10,
            activeUsers: 25,
            totalTasks: 200,
          }),
          revenue: expect.objectContaining({
            estimatedMRR: 99.9,
          }),
          users: sampleUsers,
        })
      );
    });
  });

  describe("updateUser", () => {
    it("should reject updates from non-admin users", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "USER" });

      const req = {
        userId: "user-id",
        params: { id: "target-user-id" },
        body: { role: "ADMIN" },
      } as unknown as Request;
      const res = mockResponse();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should update user properties and record an audit log", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ role: "ADMIN", name: "Admin" });
      const updatedUser = {
        id: "target-123",
        name: "Updated Name",
        email: "target@hikarii.org",
        role: "ADMIN",
        subscriptionStatus: "PRO",
      };
      (prisma.user.update as any).mockResolvedValue(updatedUser);

      const req = {
        userId: "admin-id",
        params: { id: "target-123" },
        body: { name: "Updated Name", role: "ADMIN", subscriptionStatus: "PRO" },
        ip: "127.0.0.1",
      } as unknown as Request;
      const res = mockResponse();

      await updateUser(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "target-123" },
          data: expect.objectContaining({ name: "Updated Name", role: "ADMIN" }),
        })
      );
      expect(AdminService.recordAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: "admin-id",
          action: "UPDATE_USER",
          targetId: "target-123",
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User updated successfully",
          user: expect.objectContaining({ id: "target-123", role: "ADMIN" }),
        })
      );
    });
  });
});
