import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    // Override COOP/COEP headers so Google OAuth popup (window.closed) works
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into a separate vendor chunk to save memory during build
          if (id.includes('node_modules')) {
            // Must include 'scheduler' with react because react-dom depends on it internally
            if (
              id.includes('/react/') || 
              id.includes('/react-dom/') || 
              id.includes('/react-router') ||
              id.includes('/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-core';
          }
        }
      },
      onwarn(warning, warn) {
        // Suppress "use client" / "use server" directive warnings from third-party packages
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
