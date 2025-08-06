const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  cloudinary.api
    .ping()
    .then((res) => console.log(" Cloudinary Connected:", res))
    .catch((err) => console.error(" Cloudinary Connection Failed:", err.message));
} catch (error) {
  console.error(" Cloudinary Config Error:", error.message);
}

module.exports = cloudinary;
