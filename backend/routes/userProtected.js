const express = require("express");
const userAuth = require("../middleware/userAuth");
const User = require("../models/user");

const router = express.Router();

router.get("/dashboard", userAuth, async (req, res) => {
  try {
    // ✅ Database se pura user fetch karo
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;