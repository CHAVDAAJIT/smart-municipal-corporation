const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({ _id: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add new admin
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, mobile, password: hashed });

    res.status(201).json({
      message: "Admin created successfully",
      admin: { _id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    // Current admin ko delete nahi kar sakte
    if (req.params.id === req.admin.id) {
      return res.status(400).json({ message: "You cannot delete yourself!" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(req.params.id, { password: hashed });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};