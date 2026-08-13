const express = require("express");
const { calculatePrice } = require("../services/pricing");

const router = express.Router();

// POST /api/recalculate-price  (JSON: { outfitType, fabrics: [{ name, role }] })
// Used whenever the customer overrides the outfit type or any fabric
// dropdown (primary or secondary) - fires on every change, matching the
// existing single-fabric override behavior. This is the ONLY time price
// should be recalculated after Step 3 - once the customer moves to the
// contact form, the frontend must hold onto the last returned price and
// never call this again for the same session.
router.post("/recalculate-price", express.json(), async (req, res) => {
  try {
    const { outfitType, fabrics } = req.body;
    if (!outfitType || !fabrics) {
      return res.status(400).json({ error: "outfitType and fabrics are required." });
    }
    const price = calculatePrice(outfitType, fabrics);
    res.json({ price });
  } catch (err) {
    console.error("[/api/recalculate-price] error:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
