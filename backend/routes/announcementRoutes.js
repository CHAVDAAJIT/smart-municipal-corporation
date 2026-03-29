const express = require("express");
const router = express.Router();
const {
  getAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  toggleActive,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.get("/", userAuth, getAnnouncements);

// Admin
router.get("/all", adminAuth, getAllAnnouncements);
router.post("/", adminAuth, createAnnouncement);
router.put("/:id", adminAuth, updateAnnouncement);
router.put("/:id/toggle", adminAuth, toggleActive);
router.delete("/:id", adminAuth, deleteAnnouncement);

module.exports = router;