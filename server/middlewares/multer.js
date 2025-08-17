const multer = require("multer");

// Memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format (only jpeg, jpg, png, webp allowed)"), false);
  }
};

// Final multer config
const upload = multer({ storage, fileFilter });

module.exports = upload;
