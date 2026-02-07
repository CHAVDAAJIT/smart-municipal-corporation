const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* ================= USER REGISTER ================= */

router.post("/register/user", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 🔎 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Save user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    // 🎫 Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= USER LOGIN ================= */
router.post("/login/user", async (req, res) => {
  try {
    const { email, password, captcha, captchaText } = req.body;

    // ❌ CAPTCHA BACKEND CHECK
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

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});


module.exports = router;
