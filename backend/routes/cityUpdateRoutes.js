const express = require("express");
const router = express.Router();
const {
  getUpdates,
  getAllUpdates,
  createUpdate,
  toggleActive,
  deleteUpdate,
} = require("../controllers/cityUpdateController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.get("/", userAuth, getUpdates);

// Admin
router.get("/all", adminAuth, getAllUpdates);
router.post("/", adminAuth, createUpdate);
router.put("/:id/toggle", adminAuth, toggleActive);
router.delete("/:id", adminAuth, deleteUpdate);

module.exports = router;