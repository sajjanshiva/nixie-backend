require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./routes/analyze");
const priceRoutes = require("./routes/price");
const leadRoutes = require("./routes/lead");
const adminRoutes = require("./routes/admin");
const sheetsData = require("./services/sheetsData");

const REQUIRED_ENV_VARS = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_CLIENT_ID",
  "SHOPIFY_CLIENT_SECRET",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
  "GEMINI_API_KEY",
  "GOOGLE_SHEET_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(
    `[startup warning] Missing env vars: ${missing.join(", ")}. ` +
    `Copy .env.example to .env and fill these in before testing the related endpoints.`
  );
}

const app = express();

app.use(cors()); // for local dev; tighten to your storefront's origin before going live
app.use("/api", analyzeRoutes);
app.use("/api", priceRoutes);
app.use("/api", leadRoutes);
app.use("/api", adminRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

async function start() {
  console.log("[startup] Loading pricing data from Google Sheets...");
  try {
    await sheetsData.refresh();
  } catch (err) {
    console.error("[startup] FATAL: could not load pricing data on startup:", err.message);
    console.error("[startup] Check GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
      "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and that the sheet is shared with the service account.");
    process.exit(1);
  }

  sheetsData.startAutoRefresh();

  app.listen(PORT, () => {
    console.log(`Nixie backend running on http://localhost:${PORT}`);
  });
}

start();
