const User = require("../models/user-model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ✅ Get user profile + blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username name profilePhoto");

    res.status(200).json({ userProfile: user, blogs });
  } catch (error) {
    console.error("Get user blogs error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Update user profile with Cloudinary
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userID;
    const { bio, socialLinks, name, username } = req.body;

    // Check username uniqueness
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) return res.status(400).json({ message: "Username already taken" });
    }

    let profilePhotoUrl;
    if (req.file) {
      // Cloudinary upload using buffer
      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_photos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      profilePhotoUrl = uploaded.secure_url;
    }

    // Build update object dynamically
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (profilePhotoUrl) updateData.profilePhoto = profilePhotoUrl;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpiry");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
