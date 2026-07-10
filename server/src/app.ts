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
import collaborationRoutes from "./routes/collaboration.routes";
import articleFeedbackRoutes from "./routes/articleFeedback.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

// CORS Configuration (Must be before other middleware to handle OPTIONS preflight)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://www.Hikariii.org",
  "https://Hikariii.org",
  "https://checkmate-production-7067.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development";

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin: ${origin}`);
        callback(null, false);
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
      "baggage",
      "sentry-trace",
      "access-control-allow-headers",
      "x-sentry-auth",
    ],
    optionsSuccessStatus: 204,
  }),
);

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. HTTP Parameter Pollution protection
app.use(hpp());

// 3. Body Parser with Size Limits (Prevents large payload attacks)
app.use(express.json({ limit: "10kb" }));

// 4. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs (for contact forms, etc)
  message: "Too many requests submitted. Please try again later.",
});

app.use("/api/", globalLimiter);
app.use("/api/contact", strictLimiter);
app.use("/api/leads", strictLimiter);

// 4. Request Logging for Debugging CORS/Preflight in Production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || "No Origin"}`,
    );
  }
  next();
});

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
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/article-feedback", articleFeedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/v", (req, res) => {
  res.json({ v: "v1.0.1-fix-buffering" });
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

const PORT = process.env.PORT || 5005;
const PORT_NUM = Number(PORT) || 5005;

app.listen(PORT_NUM, () => {
  // Check if we need to start cron jobs
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    import("./jobs/queue.js")
      .then(({ setupRepeatableJobs }) => {
        setupRepeatableJobs();
      })
      .catch((err) => console.error("Failed to setup queue:", err));

    import("./jobs/reminder.job.js")
      .then(({ startReminderWorker }) => {
        startReminderWorker();
      })
      .catch((err) => console.error("Failed to load reminder worker:", err));

    import("./jobs/monthly.job.js")
      .then(({ startMonthlyGreetingWorker }) => {
        startMonthlyGreetingWorker();
      })
      .catch((err) => console.error("Failed to load monthly worker:", err));
  }
  console.log(`\n🚀 Server is running on port ${PORT_NUM}`);
});

export default app;
