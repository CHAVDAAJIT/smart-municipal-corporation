const express = require("express");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/verify", adminAuth, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
