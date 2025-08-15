const Blog = require("../models/blog-model");
const User = require("../models/user-model");

// GET all blogs by a specific user along with user profile
exports.getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user profile
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find blogs authored by this user
    const blogs = await Blog.find({ author: userId })
      .populate("author", "name username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      userProfile: user,
      authoredBlogs: blogs
    });
  } catch (error) {
    console.error("Get user blogs error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
