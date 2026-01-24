import connectDB from "./_backend/config/database";
import mongoose from "mongoose";

export default async function handler(_req: any, res: any) {
  let dbStatus = "unknown";
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    dbStatus = "connected";
  } catch (e: any) {
    dbStatus = `failed: ${e.message}`;
  }

  res.status(200).json({
    status: "pong",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_MONGO: !!process.env.MONGODB_URI,
    },
    db: dbStatus,
    mongoState: mongoose.connection.readyState,
  });
}
