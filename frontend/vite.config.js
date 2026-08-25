import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "nixie-widget.js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "nixie-widget.css" : "assets/[name][extname]",
      },
    },
  },
});
