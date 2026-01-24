import app from "./server.js";
import express from "express";
import path from "path";

import fs from "fs";

// Serve static files from the React app
const clientBuildPath = path.join(process.cwd(), "dist");
console.log("📂 Static files path:", clientBuildPath);

if (fs.existsSync(clientBuildPath)) {
  console.log("✅ dist folder exists");
  if (fs.existsSync(path.join(clientBuildPath, "index.html"))) {
    console.log("✅ index.html found");
    const distContents = fs.readdirSync(clientBuildPath);
    console.log("📂 dist contents:", distContents);
    if (distContents.includes("assets")) {
      console.log(
        "📂 assets contents:",
        fs.readdirSync(path.join(clientBuildPath, "assets")),
      );
    }
  } else {
    console.error("❌ index.html MISSING in dist!");
  }
} else {
  console.error("❌ dist folder MISSING at:", clientBuildPath);
  console.log("📂 Current directory contents:", fs.readdirSync(process.cwd()));
}

app.use(express.static(clientBuildPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  console.log("⚠️ Fallback route hit for:", req.path);
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
    import("./jobs/reminder.job.js")
      .then(({ startReminderJob }) => {
        startReminderJob();
      })
      .catch((err) => console.error("Failed to load cron job:", err));
  }
  console.log(`\n🚀 Server is running on port ${PORT}`);
});
