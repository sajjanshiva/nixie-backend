const express = require("express");
const upload = require("../middleware/upload");
const { uploadImage } = require("../services/imagekit");
const { detectOutfitAndFabric } = require("../services/gemini");
const { calculatePrice } = require("../services/pricing");

const router = express.Router();

// POST /api/analyze  (multipart/form-data, field name "image")
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded (expected field name 'image')." });
    }

    const [{ url: imageUrl }, detection] = await Promise.all([
      uploadImage(req.file.buffer, req.file.originalname, "/nixie/main-images"),
      detectOutfitAndFabric(req.file.buffer, req.file.mimetype),
    ]);

    const fabrics = [
      { name: detection.primaryFabric, role: "primary" },
      ...detection.secondaryFabrics.map((f) => ({ name: f.name, role: "secondary" })),
    ];
    const price = calculatePrice(detection.outfitType, fabrics);

    res.json({
      imageUrl,
      outfitType: detection.outfitType,
      primaryFabric: detection.primaryFabric,
      secondaryFabrics: detection.secondaryFabrics,
      price,
      aiComment: detection.aiComment,
    });
  } catch (err) {
    console.error("[/api/analyze] error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;