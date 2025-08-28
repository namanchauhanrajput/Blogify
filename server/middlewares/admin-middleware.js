const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminAuth;