const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, email, mobile },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// In-memory app settings (ya mongoose model bana sakte ho)
let appSettings = {
  siteName: "Smart Municipal Corporation",
  contactEmail: "admin@smartmunicipal.gov.in",
  contactPhone: "+91 79 2234 5678",
  address: "Municipal Corporation Office, Ahmedabad, Gujarat",
  website: "www.smartmunicipal.gov.in",
  notifications: {
    emailNotifications: true,
    complaintAlerts: true,
    paymentAlerts: true,
    systemAlerts: false,
  }
};

exports.getAppSettings = async (req, res) => {
  res.json(appSettings);
};

exports.updateAppSettings = async (req, res) => {
  try {
    appSettings = { ...appSettings, ...req.body };
    res.json({ message: "Settings updated", settings: appSettings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};