const express = require("express");
const userAuth = require("../middleware/userAuth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Get dashboard
router.get("/dashboard", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      message: "User verified",
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update profile
router.put("/profile", userAuth, async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, mobile },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Change password
router.put("/change-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Min 6 characters required" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;