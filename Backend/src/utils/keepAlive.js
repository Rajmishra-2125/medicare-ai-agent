import cron from "node-cron";
import axios from "axios";

export const startKeepAlive = () => {
  console.log("⏳ Initializing Render Keep-Alive self-pings...");

  // Schedule to run every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    let url = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
    if (!url) {
      console.log(
        "ℹ️  No RENDER_EXTERNAL_URL or SERVER_URL configured — skipping keep-alive ping."
      );
      return;
    }

    url = url.replace(/\/$/, "");

    try {
      console.log(`📡 Keep-Alive self-ping: ${url}/healthcheck`);
      const response = await axios.get(`${url}/healthcheck`);
      console.log(`✅ Keep-Alive ping succeeded! Status: ${response.status}`);
    } catch (error) {
      console.error(`❌ Keep-Alive ping failed: ${error.message}`);
    }
  });
};
