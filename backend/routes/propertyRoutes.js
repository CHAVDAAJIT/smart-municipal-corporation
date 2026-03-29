const express = require("express");
const router = express.Router();
const {
  getPropertyById, payTax,
  getAllProperties, addProperty,
  updateProperty, updatePaymentStatus,
  deleteProperty,
} = require("../controllers/propertyController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.get("/search/:propertyId", userAuth, getPropertyById);
router.post("/pay", userAuth, payTax);

// Admin
router.get("/all", adminAuth, getAllProperties);
router.post("/", adminAuth, addProperty);
router.put("/:id", adminAuth, updateProperty);
router.put("/:id/payment-status", adminAuth, updatePaymentStatus);
router.delete("/:id", adminAuth, deleteProperty);

module.exports = router;