// Load .env variables synchronously before any other imports evaluate
import "dotenv/config";
import "./app.js";
import { server } from "./socket.js";
import connectDB from "./db/index.js";
const PORT = process.env.PORT || 8001;
const HOST = process.env.HOST || "0.0.0.0";

import setupCronJobs from "./jobs/cron.js";
import { startKeepAlive } from "./utils/keepAlive.js";

connectDB()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`✅Server is running on port ${PORT}`);
      setupCronJobs();
      startKeepAlive();
    });
  })
  .catch((err) => {
    console.log("❌MongoDB connection error", err);
  });
