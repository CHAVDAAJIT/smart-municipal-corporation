const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAppSettings,
  updateAppSettings,
} = require("../controllers/settingsController");

const adminAuth = require("../middleware/adminAuth");

router.get("/profile", adminAuth, getProfile);
router.put("/profile", adminAuth, updateProfile);
router.put("/change-password", adminAuth, changePassword);
router.get("/app", adminAuth, getAppSettings);
router.put("/app", adminAuth, updateAppSettings);

module.exports = router;