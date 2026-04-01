const Complaint = require("../models/Complaint");
const User = require("../models/user");
const { createNotification } = require("./notificationController");

/* ================= USER ================= */

// Register complaint with photos
exports.registerComplaint = async (req, res) => {
  try {
    const { type, description, area } = req.body;

    if (!type || !description || !area) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Photos
    const photos = req.files ? req.files.map(f => f.path) : [];

    const complaint = await Complaint.create({
      user: req.user.id,
      type,
      description,
      area,
      photos,
      status: "Pending"
    });

    // ✅ 10 points for registering complaint
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 10, totalPointsEarned: 10 }
    });

    await createNotification(
      req.user.id,
      "Complaint Registered! +10 Points",
      `You earned 10 points for registering a ${type} complaint.`,
      "complaint",
      "/user/complaints"
    );

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint
    });
  } catch (err) {
    console.error("Register complaint error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get my complaints
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
      .populate("user", "name email points")
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
    res.json({ message: "Department assigned", complaint });
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

// ✅ Award points to citizen
exports.awardPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;

    const complaint = await Complaint.findById(req.params.id)
      .populate("user");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update complaint
    complaint.pointsAwarded = points;
    complaint.pointsReason = reason;
    await complaint.save();

    // Update user points
    await User.findByIdAndUpdate(complaint.user._id, {
      $inc: { points: points, totalPointsEarned: points }
    });

    // Notification
    await createNotification(
      complaint.user._id,
      `🎉 You earned ${points} points!`,
      `Admin awarded you ${points} points for your complaint. Reason: ${reason}`,
      "complaint",
      "/user/points"
    );

    res.json({ message: `${points} points awarded!` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email points");
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STATS ================= */

exports.getCitizenStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Complaint.countDocuments({ user: userId });
    const pending = await Complaint.countDocuments({ user: userId, status: { $regex: /^pending$/i } });
    const resolved = await Complaint.countDocuments({ user: userId, status: { $regex: /^resolved$/i } });
    res.json({ total, pending, resolved });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: { $regex: /^pending$/i } });
    const resolvedComplaints = await Complaint.countDocuments({ status: { $regex: /^resolved$/i } });
    const activeCitizens = await User.countDocuments();
    res.json({ totalComplaints, pendingComplaints, resolvedComplaints, activeCitizens });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// ✅ Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ totalPointsEarned: { $gt: 0 } })
      .select("name email totalPointsEarned points")
      .sort({ totalPointsEarned: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};