const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  deleteAll,
} = require("../controllers/notificationController");

const userAuth = require("../middleware/userAuth");

router.get("/", userAuth, getNotifications);
router.put("/read-all", userAuth, markAllRead);    // ✅ pehle specific
router.put("/:id/read", userAuth, markRead);        // ✅ baad mein dynamic
router.delete("/", userAuth, deleteAll);            // ✅ pehle specific
router.delete("/:id", userAuth, deleteNotification); // ✅ baad mein dynamic
module.exports = router;