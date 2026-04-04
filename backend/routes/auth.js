const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const OTP = require("../models/otp");
const { sendOTPEmail, sendForgotPasswordEmail } = require("../utils/emailService");

const router = express.Router();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================= USER REGISTER ================= */
router.post("/register/user", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, mobile,
      password: hashedPassword,
      isVerified: false, // ✅ not verified yet
    });

    // Send OTP
    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      type: "verify",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
    });

    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: "Registration successful! Please verify your email.",
      email,
      requiresVerification: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "verify",
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: "user", email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Email verified successfully!",
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ================= RESEND OTP ================= */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old OTPs
    await OTP.deleteMany({ email, type: "verify" });

    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      type: "verify",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOTPEmail(email, otp, user.name);

    res.json({ message: "OTP resent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

/* ================= USER LOGIN ================= */
router.post("/login/user", async (req, res) => {
  try {
    const { email, password, captcha, captchaText } = req.body;

    if (captcha !== captchaText) {
      return res.status(400).json({ message: "Invalid captcha" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if verified
    if (!user.isVerified) {
      // Resend OTP
      await OTP.deleteMany({ email, type: "verify" });
      const otp = generateOTP();
      await OTP.create({
        email, otp, type: "verify",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });
      await sendOTPEmail(email, otp, user.name);

      return res.status(403).json({
        message: "Email not verified. OTP sent!",
        requiresVerification: true,
        email
      });
    }

    const token = jwt.sign(
      { id: user._id, role: "user", email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "User login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Delete old OTPs
    await OTP.deleteMany({ email, type: "forgot" });

    const otp = generateOTP();
    await OTP.create({
      email, otp, type: "forgot",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendForgotPasswordEmail(email, otp, user.name);

    res.json({ message: "OTP sent to your email!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY FORGOT OTP ================= */
router.post("/verify-forgot-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email, otp, type: "forgot",
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified!", verified: true });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email, otp, type: "forgot",
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    // Mark OTP used
    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed" });
  }
});

module.exports = router;