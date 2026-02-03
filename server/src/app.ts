import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

// Import route handlers
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import projectRoutes from "./routes/project.routes";
import budgetRoutes from "./routes/budget.routes";
import insightsRoutes from "./routes/insights.routes";
import predictiveRoutes from "./routes/predictive.routes";
import patternRoutes from "./routes/pattern.routes";
import stripeRoutes from "./routes/stripe.routes";
import googleRoutes from "./routes/google.routes";
import contactRoutes from "./routes/contact.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", budgetRoutes); // Mounts /budgets and /expenses
app.use("/api/insights", insightsRoutes);
app.use("/api/predictive", predictiveRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from the React app
const clientBuildPath = path.join(process.cwd(), "dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    // If it's an API request that wasn't handled, don't return HTML
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API Route not found" });
      return;
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  console.log(
    "Client build not found at (only API operational):",
    clientBuildPath,
  );
}

const PORT = process.env.PORT || 5000;

// Export for server.ts (if separated) or listen directly if main entry
// based on package.json build script, this file is the entry point.

const PORT_NUM = Number(PORT) || 5000;
app.listen(PORT_NUM, "0.0.0.0", () => {
  // Check if we need to start cron jobs
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    import("./jobs/reminder.job.js")
      .then(({ startReminderJob }) => {
        startReminderJob();
      })
      .catch((err) => console.error("Failed to load cron job:", err));
  }
  console.log(`\n🚀 Server is running on port ${PORT_NUM}`);
});

export default app;
