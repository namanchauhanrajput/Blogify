const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/userController");
const auth = require("../middlewares/auth-middleware");

// 🔍 GET /api/users/search?username=tan
router.get("/search", auth, searchUsers);

module.exports = router;   // ✅ Sirf router export karo
