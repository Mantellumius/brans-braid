import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const generateScopedNameDev = (name, filename) => `${filename.split('/').at(-1).split('.')[0]}-${name}`;


export default defineConfig(async ({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "hooks": path.resolve(__dirname, "./src/hooks"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "stores": path.resolve(__dirname, "./src/stores"),
      "assets": path.resolve(__dirname, "./src/assets"),
      "shared": path.resolve(__dirname, "./src/shared"),
      "app": path.resolve(__dirname, "./src/app"),
      "widgets": path.resolve(__dirname, "./src/widgets"),
    }
  },
  css: {
    modules: {
      generateScopedName: mode === 'development' ? generateScopedNameDev : '[hash:base64:12]',
    }
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
}));
