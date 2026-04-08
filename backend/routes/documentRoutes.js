const express = require("express");
const router = express.Router();

// ✅ Cloudinary uploader
const { uploadDocumentFiles } = require("../utils/cloudinary");

const {
  createRequest,
  getUserDocs,
  updateStatus,
  getAllDocuments,
} = require("../controllers/documentController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// User
router.post("/request", userAuth, uploadDocumentFiles, createRequest);
router.get("/", userAuth, getUserDocs);

// Admin
router.get("/all", adminAuth, getAllDocuments);
router.put("/:id/status", adminAuth, updateStatus);

module.exports = router;