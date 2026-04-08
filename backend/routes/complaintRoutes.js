const express = require("express");
const router = express.Router();

// ✅ Cloudinary uploader use karo
const { uploadComplaintPhotos } = require("../utils/cloudinary");

const {
  registerComplaint,
  getMyComplaints,
  getAllComplaints,
  assignDepartment,
  updateStatus,
  getComplaintById,
  getCitizenStats,
  getAdminStats,
  awardPoints,
  getLeaderboard,
  editComplaint,
  cancelComplaint,
} = require("../controllers/complaintController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

/* ===== USER ===== */
// ✅ multer ki jagah cloudinary uploader
router.post("/", userAuth, uploadComplaintPhotos, registerComplaint);
router.get("/my", userAuth, getMyComplaints);
router.get("/stats", userAuth, getCitizenStats);
router.put("/edit/:id", userAuth, editComplaint);
router.put("/cancel/:id", userAuth, cancelComplaint);

/* ===== PUBLIC ===== */
router.get("/leaderboard", userAuth, getLeaderboard);

/* ===== ADMIN ===== */
router.get("/admin-stats", adminAuth, getAdminStats);
router.get("/all", adminAuth, getAllComplaints);
router.get("/:id", adminAuth, getComplaintById);
router.put("/assign/:id", adminAuth, assignDepartment);
router.put("/status/:id", adminAuth, updateStatus);
router.put("/award-points/:id", adminAuth, awardPoints);

module.exports = router;