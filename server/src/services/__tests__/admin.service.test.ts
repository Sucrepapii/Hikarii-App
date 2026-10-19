import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminService, { AuditLogParams } from "../admin.service";
import prisma from "../../config/db";
import { sendEmail } from "../email.service";

// Mock dependencies
vi.mock("../../config/db", () => ({
  default: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("../email.service", () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: "msg-123" }),
}));

vi.mock("../../config/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("AdminService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("recordAuditLog", () => {
    it("should successfully record an audit log with full details", async () => {
      const mockRecord = {
        id: "log-123",
        adminId: "admin-1",
        action: "SUSPEND_USER",
        targetId: "user-456",
        targetType: "USER",
        details: { reason: "Terms violation" },
        ipAddress: "192.168.1.1",
        createdAt: new Date(),
      };
      (prisma.auditLog.create as any).mockResolvedValue(mockRecord);

      const params: AuditLogParams = {
        adminId: "admin-1",
        action: "SUSPEND_USER",
        targetId: "user-456",
        targetType: "USER",
        details: { reason: "Terms violation" },
        ipAddress: "192.168.1.1",
      };

      const result = await AdminService.recordAuditLog(params);

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          adminId: "admin-1",
          action: "SUSPEND_USER",
          targetId: "user-456",
          targetType: "USER",
          details: { reason: "Terms violation" },
          ipAddress: "192.168.1.1",
        },
      });
      expect(result).toEqual(mockRecord);
    });

    it("should fallback to empty object if details is omitted", async () => {
      (prisma.auditLog.create as any).mockResolvedValue({ id: "log-456" });

      const params: AuditLogParams = {
        adminId: "admin-2",
        action: "VIEW_METRICS",
        targetId: "system",
        targetType: "SYSTEM",
      };

      await AdminService.recordAuditLog(params);

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          details: {},
        }),
      });
    });

    it("should log error and rethrow when prisma fails", async () => {
      const dbError = new Error("Database connection timed out");
      (prisma.auditLog.create as any).mockRejectedValue(dbError);

      const params: AuditLogParams = {
        adminId: "admin-1",
        action: "DELETE_USER",
        targetId: "user-999",
        targetType: "USER",
      };

      await expect(AdminService.recordAuditLog(params)).rejects.toThrow(
        "Database connection timed out"
      );
    });
  });

  describe("sendAdminOnboardingEmail", () => {
    it("should dispatch onboarding email with credentials", async () => {
      await AdminService.sendAdminOnboardingEmail(
        "Jane Doe",
        "jane@hikarii.org",
        "TempPass123!"
      );

      expect(sendEmail).toHaveBeenCalledWith(
        "jane@hikarii.org",
        "Welcome to the Admin Team - Hikarii",
        expect.stringContaining("Jane Doe")
      );
      expect(sendEmail).toHaveBeenCalledWith(
        "jane@hikarii.org",
        "Welcome to the Admin Team - Hikarii",
        expect.stringContaining("TempPass123!")
      );
    });

    it("should gracefully catch errors without throwing", async () => {
      (sendEmail as any).mockRejectedValueOnce(new Error("SMTP failure"));

      await expect(
        AdminService.sendAdminOnboardingEmail("Jane", "jane@hikarii.org", "pass")
      ).resolves.not.toThrow();
    });
  });

  describe("sendSuspensionNotification", () => {
    it("should send suspension email with reason and expiration date", async () => {
      const expiry = new Date("2026-12-31T23:59:59Z");
      await AdminService.sendSuspensionNotification(
        "John User",
        "john@example.com",
        "Multiple spam reports",
        expiry
      );

      expect(sendEmail).toHaveBeenCalledWith(
        "john@example.com",
        "Account Suspended - Hikarii",
        expect.stringContaining("John User")
      );
      expect(sendEmail).toHaveBeenCalledWith(
        "john@example.com",
        "Account Suspended - Hikarii",
        expect.stringContaining("Multiple spam reports")
      );
    });

    it("should gracefully catch error without throwing", async () => {
      (sendEmail as any).mockRejectedValueOnce(new Error("Email error"));

      await expect(
        AdminService.sendSuspensionNotification("John", "john@example.com")
      ).resolves.not.toThrow();
    });
  });

  describe("sendReactivationNotification", () => {
    it("should send reactivation email", async () => {
      await AdminService.sendReactivationNotification("John User", "john@example.com");

      expect(sendEmail).toHaveBeenCalledWith(
        "john@example.com",
        "Account Reactivated - Hikarii",
        expect.stringContaining("John User")
      );
    });

    it("should gracefully catch error without throwing", async () => {
      (sendEmail as any).mockRejectedValueOnce(new Error("Network timeout"));

      await expect(
        AdminService.sendReactivationNotification("John", "john@example.com")
      ).resolves.not.toThrow();
    });
  });
});
