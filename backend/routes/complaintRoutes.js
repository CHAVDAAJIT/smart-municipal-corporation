const express = require("express");
const router = express.Router();

const {
  registerComplaint,
  getMyComplaints,
  getAllComplaints,
  assignDepartment,
  updateStatus,
  getComplaintById,
  getCitizenStats,
  getAdminStats
} = require("../controllers/complaintController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

/* ===== USER ===== */
router.post("/", userAuth, registerComplaint);
router.get("/my", userAuth, getMyComplaints);
router.get("/stats", userAuth, getCitizenStats);

/* ===== ADMIN ===== */
router.get("/admin-stats", adminAuth, getAdminStats); // ✅ alag path
router.get("/all", adminAuth, getAllComplaints);       // ✅ alag path
router.get("/:id", adminAuth, getComplaintById);
router.put("/assign/:id", adminAuth, assignDepartment);
router.put("/status/:id", adminAuth, updateStatus);

module.exports = router;