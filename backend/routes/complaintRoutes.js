const express = require("express");
const router = express.Router();

const {
  registerComplaint,
  getMyComplaints,
  getAllComplaints,
  assignDepartment,
  updateStatus,
  getComplaintById
} = require("../controllers/complaintController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");
const { getCitizenStats } = require("../controllers/complaintController");
const { getAdminStats } = require("../controllers/complaintController");

/* ===== USER ===== */
router.post("/", userAuth, registerComplaint);
router.get("/my", userAuth, getMyComplaints);
router.get("/stats", userAuth, getCitizenStats);
/* ===== ADMIN ===== */
router.get("/", adminAuth, getAllComplaints);
router.get("/:id", adminAuth, getComplaintById);
router.put("/assign/:id", adminAuth, assignDepartment);
router.put("/status/:id", adminAuth, updateStatus);
router.get("/stats", adminAuth, getAdminStats);

module.exports = router;
