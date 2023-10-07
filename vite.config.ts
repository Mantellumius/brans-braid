import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(async () => ({
  plugins: [react()],

  resolve: {
    alias: {
      "assets": path.resolve(__dirname, "./src/assets"),
      "shared": path.resolve(__dirname, "./src/shared"),
      "app": path.resolve(__dirname, "./src/app"),
      "widgets": path.resolve(__dirname, "./src/widgets"),
    }
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
}));
