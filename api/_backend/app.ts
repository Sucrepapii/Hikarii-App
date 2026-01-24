import app from "./server";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Helper for ESM directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, "../../../dist");
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Check if we need to start cron jobs
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    import("./jobs/reminder.job")
      .then(({ startReminderJob }) => {
        startReminderJob();
      })
      .catch((err) => console.error("Failed to load cron job:", err));
  }
  console.log(`\n🚀 Server is running on port ${PORT}`);
});
