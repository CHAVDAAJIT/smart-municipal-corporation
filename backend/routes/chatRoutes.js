const express = require("express");
const router = express.Router();
const { getChatHistory, getAllRooms, markRead } = require("../controllers/chatController");
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

router.get("/history/:roomId", userAuth, getChatHistory);
router.get("/rooms", adminAuth, getAllRooms);
router.put("/read/:roomId", adminAuth, markRead);

module.exports = router;