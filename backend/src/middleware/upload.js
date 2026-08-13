const multer = require("multer");

const MAX_FILE_SIZE_MB = 10;
const storage = multer.memoryStorage(); // buffers in memory only, never written to disk

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, and WEBP images are allowed."));
    }
    cb(null, true);
  },
});

module.exports = upload;
