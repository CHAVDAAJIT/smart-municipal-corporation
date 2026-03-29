const express = require("express");
const router = express.Router();
const {
  createComplaint, getMyComplaints, getTrucks,
  getAllComplaints, updateComplaintStatus,
  getAllTrucks, updateTruckStatus, addTruck,
} = require("../controllers/garbageController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.post("/complaint", userAuth, createComplaint);
router.get("/my-complaints", userAuth, getMyComplaints);
router.get("/trucks", userAuth, getTrucks);

// Admin
router.get("/all-complaints", adminAuth, getAllComplaints);
router.put("/complaint/:id/status", adminAuth, updateComplaintStatus);
router.get("/all-trucks", adminAuth, getAllTrucks);
router.put("/truck/:id", adminAuth, updateTruckStatus);
router.post("/truck", adminAuth, addTruck);

module.exports = router;
