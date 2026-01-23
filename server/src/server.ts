import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import budgetRoutes from "./routes/budget.routes";
import insightsRoutes from "./routes/insights.routes";
import { startReminderJob } from "./jobs/reminder.job";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // Start background jobs
      startReminderJob();

      console.log(`\n🚀 Server is running`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
