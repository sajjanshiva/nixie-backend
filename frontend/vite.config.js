import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "extract-css",
      closeBundle() {
        if (fs.existsSync("dist/nixie-widget.js")) {
          const code = fs.readFileSync("dist/nixie-widget.js", "utf8");
          const marker = "Sl.textContent=`";
          const start = code.indexOf(marker);
          const end = code.indexOf("document.head.appendChild(Sl);");
          if (start > -1 && end > -1) {
            const css = code.substring(start + marker.length, end - 2);
            fs.writeFileSync("dist/nixie-widget.css", css, "utf8");
          }
        }
      },
    },
  ],
  build: {
    assetsInlineLimit: 1000000,
    cssMinify: false,
    rollupOptions: {
      output: {
        format: "iife",
        entryFileNames: "nixie-widget.js",
      },
    },
  },
});
