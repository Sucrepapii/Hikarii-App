import { Worker, Job } from 'bullmq';
import redisClient from '../config/redis';
import prisma from "../config/db";
import { notifyUser } from "../services/notification.service";

export const startMonthlyGreetingWorker = () => {
  if (process.env.VERCEL) {
    console.log(
      "Workers are not supported on Vercel Serverless. Skipping...",
    );
    return;
  }
  
  if (!redisClient) {
    console.warn("Redis is not configured. Monthly Worker skipped.");
    return;
  }

  const worker = new Worker('monthly-queue', async (job: Job) => {
    console.log("Running monthly greeting job via BullMQ...");
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
      throw error;
    }
  }, { connection: redisClient });

  worker.on('failed', (job, err) => {
    console.error(`Monthly Job ${job?.id} failed:`, err);
  });
};
