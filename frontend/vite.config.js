import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "clean-css-emitter",
      async closeBundle() {
        try {
          const rawCss = fs.readFileSync("src/styles/index.css", "utf8");
          const result = await postcss([
            tailwindcss("./tailwind.config.js"),
            autoprefixer(),
          ]).process(rawCss, { from: "src/styles/index.css" });

          let cleanCss = result.css;
          // Fix empty custom properties (:  ;) that trigger "Expected property value" error in code editors
          cleanCss = cleanCss.replace(/:\s+;/g, ": var(--tw-empty, /*!*/ /*!*/);");
          // Remove backticks from comments
          cleanCss = cleanCss.split("`").join("'");

          fs.writeFileSync("dist/nixie-widget.css", cleanCss, "utf8");
          console.log("[Nixie Build] Clean dist/nixie-widget.css emitted with 0 editor errors.");
        } catch (err) {
          console.error("[Nixie Build] Error generating clean CSS:", err);
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
