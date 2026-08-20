import { Queue, Worker, Job } from 'bullmq';
import redisClient from '../config/redis';

// Define Queues
let reminderQueue: Queue | null = null;
let monthlyQueue: Queue | null = null;
let trialQueue: Queue | null = null;

if (redisClient) {
    reminderQueue = new Queue('reminder-queue', { connection: redisClient as any });
    monthlyQueue = new Queue('monthly-queue', { connection: redisClient as any });
    trialQueue = new Queue('trial-queue', { connection: redisClient as any });
}

export const setupRepeatableJobs = async () => {
    if (!redisClient) return;

    // Run every day at 10:00 AM
    await reminderQueue?.add('daily-reminder', {}, {
        repeat: { pattern: '0 10 * * *' }
    });

    // Run at 9:00 AM on the 1st of every month
    await monthlyQueue?.add('monthly-greeting', {}, {
        repeat: { pattern: '0 9 1 * *' }
    });

    // Run every day at Midnight to clean up expired trials
    await trialQueue?.add('trial-expiration', {}, {
        repeat: { pattern: '0 0 * * *' }
    });
};

export { reminderQueue, monthlyQueue, trialQueue };

