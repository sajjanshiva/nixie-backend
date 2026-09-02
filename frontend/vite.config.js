import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 1000000,
    rollupOptions: {
      output: {
        entryFileNames: "nixie-widget.js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "nixie-widget.css" : "assets/[name][extname]",
      },
    },
  },
});
