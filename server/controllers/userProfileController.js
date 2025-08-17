const Blog = require("../models/blog-model");
const User = require("../models/user-model");

// ✅ Get user profile + blogs
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

// ✅ Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userID;
    const { bio, profilePhoto, socialLinks, name, username } = req.body;

    // Username unique check
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Update fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(bio !== undefined && { bio }),
          ...(profilePhoto !== undefined && { profilePhoto }),
          ...(socialLinks && { socialLinks }),
          ...(name && { name }),
          ...(username && { username }),
        },
      },
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
    res.status(500).json({ message: "Something went wrong" });
  }
};
