const express = require("express");
const sheetsData = require("../services/sheetsData");

const router = express.Router();

// POST /api/admin/refresh-pricing-data
// Manually triggers a fresh fetch from Google Sheets instead of waiting for
// the timer. NOTE: no auth on this yet - low risk (read-only refresh) but
// worth protecting with a shared secret before production.
router.post("/admin/refresh-pricing-data", async (req, res) => {
  try {
    await sheetsData.refresh();
    res.json({ status: "ok", lastUpdated: sheetsData.getLastUpdated() });
  } catch (err) {
    console.error("[/api/admin/refresh-pricing-data] error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
