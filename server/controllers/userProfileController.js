const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const cloudinary = require("cloudinary").v2;

// Cloudinary config (make sure .env me keys set ho)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get user profile + blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find user
    const user = await User.findById(userId).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get blogs of that user
    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username name profilePhoto");

    res.status(200).json({
      userProfile: user,
      blogs,
    });
  } catch (error) {
    console.error("Get user blogs error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//  Helper function for Cloudinary upload (stream wrapper)
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_photos" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userID; // middleware se aa rha hai
    const { bio, socialLinks, name, username } = req.body;

    // Check if username already taken (other than this user)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    //  Upload profile photo (if file provided)
    let profilePhoto;
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file.buffer);
    }

    //  Prepare update fields
    const updateFields = {};
    if (bio) updateFields.bio = bio;
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (profilePhoto) updateFields.profilePhoto = profilePhoto;
    
    //  Handle social links - Ensure the format is correct (object)
    if (socialLinks) {
      if (typeof socialLinks === 'string') {
        try {
          // Parse socialLinks if it's a string (in case it's passed as a JSON string)
          updateFields.socialLinks = JSON.parse(socialLinks);
        } catch (err) {
          return res.status(400).json({ message: "Invalid socialLinks format" });
        }
      } else if (typeof socialLinks === 'object') {
        // If it's already an object, we can directly assign it
        updateFields.socialLinks = socialLinks;
      } else {
        return res.status(400).json({ message: "Invalid socialLinks format" });
      }
    }

    //  Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpiry");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
