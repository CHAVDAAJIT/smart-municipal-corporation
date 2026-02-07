const express = require("express");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// 🔐 VERIFY TOKEN
router.get("/verify", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

module.exports = router;
