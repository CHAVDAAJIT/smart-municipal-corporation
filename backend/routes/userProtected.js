const express = require("express");
const userAuth = require("../middleware/userAuth");

const router = express.Router();

router.get("/dashboard", userAuth, (req, res) => {
  res.json({
    message: "User verified",
    user: req.user,
  });
});

module.exports = router;
