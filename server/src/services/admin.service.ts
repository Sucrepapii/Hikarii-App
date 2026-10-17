import prisma from "../config/db";
import logger from "../config/logger";
import { sendEmail } from "./email.service";
import {
  getSuspensionTemplate,
  getReactivationTemplate,
  getAdminOnboardingTemplate,
} from "../utils/emailTemplates";

export interface AuditLogParams {
  adminId: string;
  action: string;
  targetId: string;
  targetType: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export class AdminService {
  /**
   * Log administrative actions to the database
   */
  static async recordAuditLog(params: AuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          targetId: params.targetId,
          targetType: params.targetType,
          details: params.details || {},
          ipAddress: params.ipAddress,
        },
      });
    } catch (err) {
      logger.error({ err, params }, "Failed to record admin audit log");
      throw err;
    }
  }

  /**
   * Send onboarding credentials email to newly created administrator
   */
  static async sendAdminOnboardingEmail(name: string, email: string, temporaryPassword: string) {
    try {
      await sendEmail(
        email,
        "Welcome to the Admin Team - Hikarii",
        getAdminOnboardingTemplate(name, email, temporaryPassword)
      );
      logger.info({ email, name }, "Admin onboarding email sent successfully");
    } catch (err) {
      logger.error({ err, email }, "Failed to dispatch admin onboarding email");
    }
  }

  /**
   * Notify user about account suspension
   */
  static async sendSuspensionNotification(name: string, email: string, reason?: string, expires?: Date | null) {
    try {
      const emailHtml = getSuspensionTemplate(name, reason, expires || undefined);
      await sendEmail(email, "Account Suspended - Hikarii", emailHtml);
      logger.info({ email }, "Suspension email sent successfully");
    } catch (err) {
      logger.error({ err, email }, "Failed to dispatch suspension email");
    }
  }

  /**
   * Notify user about account reactivation
   */
  static async sendReactivationNotification(name: string, email: string) {
    try {
      const emailHtml = getReactivationTemplate(name);
      await sendEmail(email, "Account Reactivated - Hikarii", emailHtml);
      logger.info({ email }, "Reactivation email sent successfully");
    } catch (err) {
      logger.error({ err, email }, "Failed to dispatch reactivation email");
    }
  }
}

export default AdminService;
