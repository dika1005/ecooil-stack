import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "node-server",
    hostname: "0.0.0.0", // Explicitly listen on all IPv4 interfaces
    port: 3000,
  },
  vite: {
    server: {
      port: 3000,
      strictPort: false, // Allow port 3001 fallback
      host: "0.0.0.0", // Listen on all IPv4 interfaces
      // Allow access from Cloudflare tunnel domain
      allowedHosts: ["ecooil.dikaramadani.tech"],
      // Disable HMR when accessed through tunnel (causes WebSocket security errors)
      hmr: false,
      fs: {
        strict: false,
        // Allow serving files from project root - fixes @fs paths through tunnel
        allow: [
          "/home/dika/ecooil-stack",
        ],
      },
    },
  },
});