const express = require("express");
const router = express.Router();
const { getReports } = require("../controllers/reportsController");
const adminAuth = require("../middleware/adminAuth");

router.get("/", adminAuth, getReports);

module.exports = router;