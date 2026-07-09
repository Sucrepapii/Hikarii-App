import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

// Create a singleton Redis client for caching and pub/sub
let redisClient: Redis | null = null;

if (redisUrl && !redisUrl.includes('YOUR_PASSWORD')) {
    redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null, // Required by BullMQ
        enableReadyCheck: false,
    });
    
    redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis Cache successfully.');
    });
} else {
    console.warn('⚠️ REDIS_URL is missing or invalid in .env. Caching and Background Jobs will be disabled.');
}

export default redisClient;
