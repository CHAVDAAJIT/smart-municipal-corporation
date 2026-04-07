const express = require("express");
const router = express.Router();
const {
  getChatHistory,
  getAllRooms,
  markRead,
  clearOldSession
} = require("../controllers/chatController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User routes
router.get("/history/:roomId", userAuth, getChatHistory);
router.post("/clear-session", userAuth, clearOldSession);

// Admin routes — ✅ admin ke liye alag route
router.get("/admin-history/:roomId", adminAuth, getChatHistory); // ✅
router.get("/rooms", adminAuth, getAllRooms);
router.put("/read/:roomId", adminAuth, markRead);

module.exports = router;