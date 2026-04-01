const express = require("express");
const router = express.Router();
const { getMyPoints, redeemPoints } = require("../controllers/pointsController");
const userAuth = require("../middleware/userAuth");

router.get("/", userAuth, getMyPoints);
router.post("/redeem", userAuth, redeemPoints);

module.exports = router;