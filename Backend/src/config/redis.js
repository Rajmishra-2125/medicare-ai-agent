import { createClient } from "redis";

// Only attempt Redis if REDIS_URL is explicitly configured.
// Without it, the agent runs without caching (no ECONNREFUSED spam in dev).
const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({
  url: REDIS_URL,
});

let connectionAttempted = false;

redisClient.on("error", (err) => {
  // Only log the first error to avoid console spam
  if (!connectionAttempted) return;
  console.warn("⚠️  Redis unavailable — caching disabled:", err.code);
});

redisClient.on("connect", () =>
  console.log("✅ Redis connected successfully!")
);

export const connectRedis = async () => {
  // Skip silently if no REDIS_URL is configured (e.g., local dev)
  if (!REDIS_URL) {
    console.log("ℹ️  REDIS_URL not set — running without Redis cache.");
    return;
  }

  try {
    connectionAttempted = true;
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.warn("⚠️  Redis connection failed — caching disabled:", err.code);
  }
};

export default redisClient;
