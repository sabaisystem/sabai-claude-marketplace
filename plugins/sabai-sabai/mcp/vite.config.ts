import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "ui",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsInlineLimit: 1000000, // Inline assets up to 1MB as base64
  },
  plugins: [react(), viteSingleFile()],
});
