const express = require("express");
const router = express.Router();
const {
  createRequest, getMyRequests, getPublicInfo,
  getAllRequests, updateStatus,
  getSchedule, addSchedule, deleteSchedule,
  getOutages, addOutage, toggleOutage, deleteOutage,
  getBillInfo, updateBillInfo,
} = require("../controllers/waterController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.post("/request", userAuth, createRequest);
router.get("/my", userAuth, getMyRequests);
router.get("/public-info", userAuth, getPublicInfo); // ✅ schedule+outage+bill

// Admin - Requests
router.get("/all", adminAuth, getAllRequests);
router.put("/:id/status", adminAuth, updateStatus);

// Admin - Schedule
router.get("/schedule", adminAuth, getSchedule);
router.post("/schedule", adminAuth, addSchedule);
router.delete("/schedule/:id", adminAuth, deleteSchedule);

// Admin - Outages
router.get("/outages", adminAuth, getOutages);
router.post("/outages", adminAuth, addOutage);
router.put("/outages/:id/toggle", adminAuth, toggleOutage);
router.delete("/outages/:id", adminAuth, deleteOutage);

// Admin - Bill Info
router.get("/bill", adminAuth, getBillInfo);
router.put("/bill", adminAuth, updateBillInfo);

module.exports = router;