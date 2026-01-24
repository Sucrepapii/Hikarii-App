import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import connectDB from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import budgetRoutes from "./routes/budget.routes";
import insightsRoutes from "./routes/insights.routes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174"
).split(",");

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        console.log("Buffered allow origins:", allowedOrigins);
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Database connection middleware - Prisma auto-connects
// app.use((_req: any, res: any, next: any) => {
//   connectDB()
//     .then(() => next())
//     .catch((err) => {
//       console.error("DB Connection Failure:", err);
//       res.status(500).json({ error: "Database connection failed" });
//     });
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", budgetRoutes); // Contains /budgets and /expenses
app.use("/api/insights", insightsRoutes);

// 404 handler
// 404 handler removed - logic moved to app.ts
// app.use((_req: Request, res: Response) => {
//   res.status(404).json({ error: "Route not found" });
// });

// Error handler (must be last)
app.use(errorHandler);

// Start server (only if not on Vercel)
// Start server (only if not on Vercel)
// if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
//   app.listen(PORT, async () => {
//     // Cron jobs are handled here only for local
//     const { startReminderJob } = await import("./jobs/reminder.job.js");
//     startReminderJob();
//     console.log(`\n🚀 Server is running on port ${PORT}`);
//   });
// }

export default app;
