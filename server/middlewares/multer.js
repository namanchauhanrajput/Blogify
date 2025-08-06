const multer = require("multer");

// Multer memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter for images + videos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/mpeg",
    "video/quicktime"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format (only images/videos allowed)"), false);
  }
};

// Final upload config
const upload = multer({ storage, fileFilter });

module.exports = upload;
