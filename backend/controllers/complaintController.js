const Complaint = require("../models/Complaint");
const User = require("../models/user");
const { createNotification } = require("./notificationController");
/* ================= USER ================= */

// Register complaint
exports.registerComplaint = async (req, res) => {
  try {
    const { type, description, area } = req.body;

    if (!type || !description || !area) {
      return res.status(400).json({ message: "All fields required" });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      type,
      description,
      area,
      status: "Pending" // ✅ DEFAULT STATUS
    });

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint
    });
  } catch (err) {
    console.error("Register complaint error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN ================= */

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Assign department
exports.assignDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { department, status: "Assigned" },
      { new: true }
    );

    res.json({
      message: "Department assigned",
      complaint
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update status



exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // ✅ Notification create karo
    await createNotification(
      complaint.user,
      "Complaint Status Updated",
      `Your complaint (#${complaint._id.toString().slice(-6)}) status changed to "${status}"`,
      "complaint",
      "/user/complaints"
    );

    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get complaint detail
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error("Error fetching complaint:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STATS ================= */

// Citizen dashboard stats
exports.getCitizenStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Complaint.countDocuments({ user: userId });

    const pending = await Complaint.countDocuments({
      user: userId,
      status: { $regex: /^pending$/i }
    });

    const resolved = await Complaint.countDocuments({
      user: userId,
      status: { $regex: /^resolved$/i }
    });

    res.json({ total, pending, resolved });
  } catch (err) {
    console.error("Citizen stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// Admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    console.log("ADMIN STATS API HIT");

    const totalComplaints = await Complaint.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({
      status: { $regex: /^pending$/i }
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: { $regex: /^resolved$/i }
    });

    const activeCitizens = await User.countDocuments();

    console.log({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      activeCitizens
    });

    res.json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      activeCitizens
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
