const User = require("../models/user-model");

// 🔍 Search Users by username (case-insensitive)
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.username; 
    if (!query) {
      return res.json([]); 
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("name username profilePhoto");

    res.json(users);
  } catch (err) {
    console.error("Error in searchUsers:", err);
    res.status(500).json({ error: "Server error" });
  }
};
