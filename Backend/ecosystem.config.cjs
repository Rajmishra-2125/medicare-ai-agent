module.exports = {
  apps: [
    {
      name: "medicare-backend",
      script: "./src/index.js",
      instances: "max", // Scale across all available CPU cores
      exec_mode: "cluster", // Run in cluster mode
      autorestart: true, // Auto-restart if it crashes
      watch: false, // Don't watch in production
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      time: true, // Prepend timestamp to logs
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
