const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
  getMyFeedback,
} = require("../controllers/feedbackController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", userAuth, submitFeedback);
router.get("/my", userAuth, getMyFeedback);
router.get("/all", adminAuth, getAllFeedback);
router.get("/stats", adminAuth, getFeedbackStats);

module.exports = router;