const Complaint = require("../models/Complaint");
const User = require("../models/user");
const { createNotification } = require("./notificationController");
const {
  sendStatusUpdateEmail,
  sendPointsEmail
} = require("../utils/emailService");
/* ================= USER ================= */

// Register complaint
exports.registerComplaint = async (req, res) => {
  try {
    const { title, type, description, area, priority, location } = req.body;

    if (!type || !description || !area) {
      return res.status(400).json({ message: "All fields required" });
    }

    const photos = req.files ? req.files.map(f => f.path) : [];

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      type,
      location,
      description,
      area,
      priority: priority || "Medium",
      photos,
      status: "Pending",
      timeline: [
        {
          status: "Pending",
          message: "Complaint submitted successfully",
          timestamp: new Date()
        }
      ]
    });

    // +10 points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 10, totalPointsEarned: 10 }
    });

    await createNotification(
      req.user.id,
      "Complaint Registered! +10 Points",
      `Your ${type} complaint has been submitted. You earned 10 points!`,
      "complaint",
      "/user/complaints"
    );

    // ✅ socket event
    if (global.io) {
      global.io.emit("newComplaint", {
        type,
        area,
        userId: req.user.id
      });
    }

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

// Edit complaint
exports.editComplaint = async (req, res) => {
  try {
    const { description, area, priority } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "Only Pending complaints can be edited"
      });
    }

    complaint.description = description || complaint.description;
    complaint.area = area || complaint.area;
    complaint.priority = priority || complaint.priority;

    complaint.timeline.push({
      status: "Pending",
      message: "Complaint details updated by citizen",
      timestamp: new Date()
    });

    await complaint.save();

    res.json({ message: "Complaint updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel complaint
exports.cancelComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "Only Pending complaints can be cancelled"
      });
    }

    complaint.status = "Cancelled";

    complaint.timeline.push({
      status: "Cancelled",
      message: "Complaint cancelled by citizen",
      timestamp: new Date()
    });

    await complaint.save();

    res.json({ message: "Complaint cancelled", complaint });
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
      {
        department,
        status: "Assigned",
        $push: {
          timeline: {
            status: "Assigned",
            message: `Assigned to ${department}`,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    await createNotification(
      complaint.user,
      "Complaint Assigned",
      `Your complaint has been assigned to ${department}`,
      "complaint",
      "/user/complaints"
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
    const messages = {
      "Pending": "Complaint marked as pending",
      "Assigned": "Complaint assigned to department",
      "Resolved": "Complaint has been resolved",
      "Cancelled": "Complaint has been cancelled"
    };

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          timeline: {
            status,
            message: messages[status] || `Status updated to ${status}`,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate("user", "name email");

    await createNotification(
      complaint.user,
      "Complaint Status Updated",
      `Your complaint status changed to "${status}"`,
      "complaint",
      "/user/complaints"
    );

    // ✅ In-app notification
    await createNotification(
      complaint.user._id,
      `Complaint Status Updated — ${status}`,
      `Your ${complaint.type} complaint (#${complaint._id.toString().slice(-6)}) is now "${status}"`,
      "complaint",
      "/user/complaints"
    );

    // ✅ Email notification
    try {
      await sendStatusUpdateEmail(complaint.user.email, complaint.user.name, {
        type: complaint.type,
        area: complaint.area,
        status,
        complaintId: complaint._id.toString().slice(-6)
      });
    } catch (emailErr) {
      console.log("Email send error:", emailErr.message);
    }

    // ✅ Socket real-time
    if (global.io) {
      global.io.emit("complaintUpdated", {
        complaintId: req.params.id,
        status,
        userId: complaint.user._id
      });
    }


    // ✅ socket event
    // if (global.io) {
    //   global.io.emit("complaintUpdated", {
    //     complaintId: req.params.id,
    //     status,
    //     userId: complaint.user
    //   });
    // }

    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Award points
exports.awardPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email points");

    if (!complaint) return res.status(404).json({ message: "Not found" });

    complaint.pointsAwarded = points;
    complaint.pointsReason = reason;
    complaint.timeline.push({
      status: complaint.status,
      message: `Admin awarded ${points} points — ${reason}`,
      timestamp: new Date()
    });
    await complaint.save();

    const updatedUser = await User.findByIdAndUpdate(
      complaint.user._id,
      { $inc: { points, totalPointsEarned: points } },
      { new: true }
    );

    // ✅ In-app notification
    await createNotification(
      complaint.user._id,
      `🎉 You earned ${points} points!`,
      `Admin awarded ${points} points. Reason: ${reason}`,
      "complaint",
      "/user/points"
    );

    // ✅ Email notification
    try {
      await sendPointsEmail(complaint.user.email, complaint.user.name, {
        points,
        reason,
        totalPoints: updatedUser.points
      });
    } catch (emailErr) {
      console.log("Email send error:", emailErr.message);
    }


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

    if (!complaint)
      return res.status(404).json({ message: "Not found" });

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
    const pending = await Complaint.countDocuments({ user: userId, status: "Pending" });
    const resolved = await Complaint.countDocuments({ user: userId, status: "Resolved" });

    res.json({ total, pending, resolved });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const activeCitizens = await User.countDocuments();

    res.json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      activeCitizens
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

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