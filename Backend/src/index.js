// Load .env variables synchronously before any other imports evaluate
import "dotenv/config";
import * as Sentry from "@sentry/node";
import { validateEnvironment } from "./utils/envValidator.js";

// Initialize Sentry for Backend Error Monitoring
Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  tracesSampleRate: 1.0,
});

validateEnvironment();

import "./app.js";
import { server } from "./socket.js";
import connectDB from "./db/index.js";
const PORT = process.env.PORT || 8001;
const HOST = process.env.HOST || "0.0.0.0";

import setupCronJobs from "./jobs/cron.js";

if (!process.env.GEMINI_MODEL) {
  console.warn(
    "⚠️  Warning: GEMINI_MODEL is missing from environment variables. Defaulting to 'gemini-2.5-flash'."
  );
}

connectDB()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`✅Server is running on port ${PORT}`);
      setupCronJobs();
    });
  })
  .catch((err) => {
    console.log("❌MongoDB connection error", err);
  });

// Global promise rejection and uncaught exception handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION thrown:", error);
  process.exit(1);
});
