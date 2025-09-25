const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const upload = require("../middlewares/multer");
const { validateBlog } = require("../middlewares/blogValidator");
const blogController = require("../controllers/blogControllers");
const userProfileController = require("../controllers/userProfileController");

// ==================== BLOG CRUD ====================
router.post(
  "/create",
  auth,
  upload.single("image"),
  validateBlog,
  blogController.createBlog
);

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", auth, upload.single("image"), blogController.updateBlog);
router.delete("/:id", auth, blogController.deleteBlog);

// ==================== LIKES & COMMENTS ====================
router.post("/like/:id", auth, blogController.toggleLikeBlog);
router.post("/comment/:id", auth, blogController.addComment);
router.get("/comments/:id", blogController.getComments);

// ==================== CATEGORIES ====================
router.get("/categories/list", blogController.getCategories);

// ==================== USER PROFILE ====================
//  Public profile (no auth required)
router.get("/user/:userId", userProfileController.getUserBlogs);

//  Update profile (protected)
router.put(
  "/user/update/profile",
  auth,
  upload.single("profilePhoto"),
  userProfileController.updateUserProfile
);

module.exports = router;
