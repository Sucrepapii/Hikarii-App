import { Worker, Job } from 'bullmq';
import redisClient from '../config/redis';
import prisma from "../config/db";

export const startTrialExpirationWorker = () => {
  if (process.env.VERCEL) {
    console.log(
      "Workers are not supported on Vercel Serverless. Skipping...",
    );
    return;
  }
  
  if (!redisClient) {
    console.warn("Redis is not configured. Trial Expiration Worker skipped.");
    return;
  }

  const worker = new Worker('trial-queue', async (job: Job) => {
    console.log("Running trial expiration job via BullMQ...");
    try {
      const now = new Date();
      
      const expiredUsers = await prisma.user.updateMany({
        where: {
          subscriptionStatus: "TRIAL",
          currentPeriodEnd: {
            lt: now,
          }
        },
        data: {
          subscriptionStatus: "FREE",
        }
      });

      console.log(`Successfully reverted ${expiredUsers.count} expired trial users to FREE.`);
    } catch (error) {
      console.error("Error in trial expiration job:", error);
      throw error;
    }
  }, { connection: redisClient as any });

  worker.on('failed', (job, err) => {
    console.error(`Trial Expiration Job ${job?.id} failed:`, err);
  });
};
