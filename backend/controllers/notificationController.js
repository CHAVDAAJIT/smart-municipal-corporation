const Notification = require("../models/notification");

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark single as read
exports.markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all as read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete all notifications
exports.deleteAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ message: "All deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create notification (internal use — other controllers call this)
exports.createNotification = async (userId, title, message, type, link = "") => {
  try {
    await Notification.create({ user: userId, title, message, type, link });
  } catch (err) {
    console.log("Notification create error:", err);
  }
};