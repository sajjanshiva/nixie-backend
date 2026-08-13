const express = require("express");
const { createLeadDraftOrder } = require("../services/shopify");

const router = express.Router();

// POST /api/submit-lead
// JSON body: {
//   category, outfitType, finalPrice,          <-- finalPrice is the SAME price already shown; not recalculated here
//   primaryFabric, secondaryFabrics: [{name}],
//   mainImageUrl,
//   name, phone, email, address, city, state, pincode
// }
router.post("/submit-lead", express.json(), async (req, res) => {
  try {
    const {
      category,
      outfitType,
      finalPrice,
      primaryFabric,
      secondaryFabrics = [],
      mainImageUrl,
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // category is looked up from the outfit's own sheet row (see
    // pricing.getCategoryForOutfit) and is for staff reference only - it
    // should NEVER block lead submission on its own. A blank Category cell
    // in the sheet is a data-completeness gap, not something the customer
    // did wrong - falling back to "Unknown" here means one missing cell in
    // the sheet can never break the actual lead capture.
    const safeCategory = category || "Unknown";

    const required = { mainImageUrl, outfitType, finalPrice, primaryFabric, name, phone, email, address, city, state, pincode };
    const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
    }
    if (secondaryFabrics.length > 2) {
      return res.status(400).json({ error: "Maximum of 2 secondary fabrics allowed." });
    }

    const draftOrder = await createLeadDraftOrder({
      category: safeCategory,
      outfitType,
      finalPrice,
      primaryFabric,
      secondaryFabrics,
      mainImageUrl,
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    });

    res.json({ draftOrder });
  } catch (err) {
    console.error("[/api/submit-lead] error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
