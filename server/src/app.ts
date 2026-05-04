import "dotenv/config";

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

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
import adminRoutes from "./routes/admin.routes";
import leadRoutes from "./routes/lead.routes";
import feedbackRoutes from "./routes/feedback.routes";

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Global Rate Limiting - Prevents DoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalLimiter);

// 3. HTTP Parameter Pollution protection
app.use(hpp());

// 4. Body Parser with Size Limits (Prevents large payload attacks)
app.use(express.json({ limit: "10kb" }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://www.hikarii.org",
  "https://hikarii.org",
  "https://checkmate-production-7067.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Tighten Railway match to specific subdomains if possible, 
      // otherwise only allow development origins if in dev mode.
      const isAllowed =
        allowedOrigins.indexOf(origin) !== -1 ||
        (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost"));

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[SECURITY] CORS Blocked Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    optionsSuccessStatus: 204,
  }),
);

app.get("/api/ai/test", (req, res) => {
  res.json({ message: "AI route test successful" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", budgetRoutes); // Mounts /budgets and /expenses
app.use("/api/insights", insightsRoutes);
app.use("/api/predictive", predictiveRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/feedback", feedbackRoutes);

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

// Ensure Sentry error handler is placed after all routes
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
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
