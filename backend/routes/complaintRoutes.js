const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

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
  editComplaint,   // ✅
  cancelComplaint, // ✅
} = require("../controllers/complaintController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* ===== USER ===== */
router.post("/", userAuth, upload.array("photos", 3), registerComplaint);
router.get("/my", userAuth, getMyComplaints);
router.get("/stats", userAuth, getCitizenStats);
router.put("/edit/:id", userAuth, editComplaint);       // ✅
router.put("/cancel/:id", userAuth, cancelComplaint);   // ✅

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