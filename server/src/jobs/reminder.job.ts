import cron from "node-cron";
import prisma from "../config/db";
// import { TaskStatus } from "../models/types";
import { sendEmail } from "../services/email.service";
import { sendWhatsAppMessage } from "../services/whatsapp.service";
import { getOverdueReminderTemplate } from "../utils/emailTemplates";
import { notifyUser } from "../services/notification.service";

export const startReminderJob = () => {
  if (process.env.VERCEL) {
    console.log(
      "Cron jobs are not supported on Vercel Serverless. Skipping...",
    );
    return;
  }
  // Run every day at 10:00 AM '0 10 * * *'
  cron.schedule("0 10 * * *", async () => {
    console.log("Running daily reminder and cleanup job...");
    try {
      // 1. Cleanup Old Chats (Keep 30 days for completed projects)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedChats = await prisma.projectComment.deleteMany({
        where: {
          createdAt: { lt: thirtyDaysAgo },
          project: {
            status: { in: ["COMPLETED", "ARCHIVED"] } // only delete if project is done
          }
        }
      });
      console.log(`Cleaned up ${deletedChats.count} old chat messages from completed projects.`);

      // 2. Daily Reminders
      const users = await prisma.user.findMany({});
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const user of users) {
        const overdueTasks = await prisma.task.findMany({
          where: {
            userId: user.id,
            status: { not: "COMPLETED" }, // Prisma enum string matching
            dueDate: { lt: today },
          },
        });

        if (overdueTasks.length > 0) {
          const taskListHtml = overdueTasks
            .map(
              (t: any) =>
                `<li><strong>${t.title}</strong> (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})</li>`,
            )
            .join("");

          await sendEmail(
            user.email,
            `Action Required: ${overdueTasks.length} Overdue Tasks on Hikari`,
            getOverdueReminderTemplate(user.name, taskListHtml),
          );

          // WhatsApp for Tasks
          if (user.waTasksEnabled && user.phoneNumber) {
            const taskList = overdueTasks
              .map(
                (t: any) =>
                  `- ${t.title} (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})`,
              )
              .join("\n");
            await sendWhatsAppMessage(
              user.phoneNumber,
              `Hi ${user.name}, you have ${overdueTasks.length} overdue tasks:\n${taskList}`,
            );
          }
        }

        // WhatsApp for Budgets
        if (user.waBudgetEnabled && user.phoneNumber) {
          const budgets = await prisma.budget.findMany({
            where: { userId: user.id },
          });

          for (const budget of budgets) {
            if (budget.spent >= budget.limit) {
              await sendWhatsAppMessage(
                user.phoneNumber,
                `Budget Alert! You have reached your limit for ${budget.category}: Spent ${budget.spent}/${budget.limit}`,
              );
            }
          }

          // Push Notification / In-App Notification
          await notifyUser(
            user.id,
            "Overdue Tasks",
            `You have ${overdueTasks.length} overdue tasks that need your attention.`,
            "REMINDER"
          );
        }

        // WhatsApp for Projects
        if (user.waProjectsEnabled && user.phoneNumber) {
          const overdueProjects = await prisma.project.findMany({
            where: {
              userId: user.id,
              status: "ACTIVE",
              endDate: { lt: today },
            },
          });

            if (overdueProjects.length > 0) {
              const projectList = overdueProjects
                .map(
                  (p: any) =>
                    `- ${p.title} (Ended: ${new Date(p.endDate).toLocaleDateString()})`,
                )
                .join("\n");
              await sendWhatsAppMessage(
                user.phoneNumber,
                `Project Alert! The following projects have passed their end date:\n${projectList}`,
              );
            }
          }

          const allOverdueProjects = await prisma.project.findMany({
            where: {
              userId: user.id,
              status: "ACTIVE",
              endDate: { lt: today },
            },
          });

          if (allOverdueProjects.length > 0) {
            await notifyUser(
              user.id,
              "Overdue Projects",
              `You have ${allOverdueProjects.length} overdue projects.`,
              "REMINDER"
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in reminder job:", error);
    }
  });
};
