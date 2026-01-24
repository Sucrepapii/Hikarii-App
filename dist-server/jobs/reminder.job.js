import cron from "node-cron";
import prisma from "../config/db";
// import { TaskStatus } from "../models/types";
import { sendEmail } from "../services/email.service";
export const startReminderJob = () => {
    if (process.env.VERCEL) {
        console.log("Cron jobs are not supported on Vercel Serverless. Skipping...");
        return;
    }
    // Run every day at 9:00 AM '0 9 * * *'
    cron.schedule("0 9 * * *", async () => {
        console.log("Running daily reminder job...");
        try {
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
                        .map((t) => `<li><strong>${t.title}</strong> (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})</li>`)
                        .join("");
                    const html = `
                        <h2>Action Required: Overdue Tasks</h2>
                        <p>Hello ${user.name},</p>
                        <p>You have <strong>${overdueTasks.length}</strong> task(s) that are past their due date:</p>
                        <ul>
                            ${taskListHtml}
                        </ul>
                        <p>Please log in to Checkmate to update your progress.</p>
                        <br/>
                        <p>Best,<br/>Checkmate Team</p>
                    `;
                    await sendEmail(user.email, `Overdue Tasks Alert (${overdueTasks.length})`, html);
                }
            }
        }
        catch (error) {
            console.error("Error in reminder job:", error);
        }
    });
};
