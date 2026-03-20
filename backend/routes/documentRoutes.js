const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createRequest,
  getUserDocs,
  updateStatus,
} = require("../controllers/documentController");

const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

const upload = multer({ dest: "uploads/" });

// User
router.post("/request", userAuth, upload.array("documents", 5), createRequest);
router.get("/", userAuth, getUserDocs);

// Admin
router.put("/:id/status", adminAuth, updateStatus);

module.exports = router;