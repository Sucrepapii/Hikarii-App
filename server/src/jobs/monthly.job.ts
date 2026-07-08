import cron from "node-cron";
import prisma from "../config/db";
import { notifyUser } from "../services/notification.service";

export const startMonthlyGreetingJob = () => {
  if (process.env.VERCEL) {
    console.log(
      "Cron jobs are not supported on Vercel Serverless. Skipping...",
    );
    return;
  }
  
  // Run at 9:00 AM on the 1st of every month
  cron.schedule("0 9 1 * *", async () => {
    console.log("Running monthly greeting job...");
    try {
      const users = await prisma.user.findMany({
        where: { pushToken: { not: null } },
      });

      const currentMonth = new Date().toLocaleString('default', { month: 'long' });

      for (const user of users) {
        if (user.id) {
          await notifyUser(
            user.id,
            "Happy New Month! 🌟",
            `Wishing you a productive and successful ${currentMonth}! Let's crush your goals on Hikari.`,
            "SYSTEM_ANNOUNCEMENT",
            { url: "/" }
          );
        }
      }
    } catch (error) {
      console.error("Error in monthly greeting job:", error);
    }
  });
};
