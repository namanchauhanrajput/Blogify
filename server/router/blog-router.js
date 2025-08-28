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

// Delete single notification
router.delete("/:id", auth, notificationController.deleteNotification);

// Delete all notifications
router.delete("/", auth, notificationController.deleteAllNotifications);

module.exports = router;