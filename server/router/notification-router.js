const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");
const notificationController = require("../controllers/notificationController");

// Get notifications
router.get("/", auth, notificationController.getNotifications);

// Mark one notification as read
router.put("/:id/read", auth, notificationController.markAsRead);

// Mark all notifications as read
router.put("/read-all", auth, notificationController.markAllAsRead);

module.exports = router;
