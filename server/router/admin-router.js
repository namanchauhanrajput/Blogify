const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/admin-middleware");
const adminController = require("../controllers/admin-controller");

// USER MANAGEMENT
router.get("/users", adminAuth, adminController.getAllUsers);
router.put("/users/:id", adminAuth, adminController.updateUser);
router.delete("/users/:id", adminAuth, adminController.deleteUser);

// BLOG MANAGEMENT
router.get("/blogs", adminAuth, adminController.getAllBlogs);
router.put("/blogs/:id", adminAuth, adminController.updateBlog);
router.delete("/blogs/:id", adminAuth, adminController.deleteBlog);

module.exports = router;