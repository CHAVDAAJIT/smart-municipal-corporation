const User = require("../models/user");
const Complaint = require("../models/Complaint");

// Get all citizens with complaint count
exports.getAllCitizens = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ _id: -1 });

    // Har user ki complaint count lo
    const usersWithCount = await Promise.all(
      users.map(async (user) => {
        const complaintCount = await Complaint.countDocuments({
          user: user._id
        });
        return {
          ...user.toObject(),
          complaintCount
        };
      })
    );

    res.json(usersWithCount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get citizen by ID
exports.getCitizenById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const complaints = await Complaint.find({ user: req.params.id })
      .sort({ createdAt: -1 });

    res.json({ user, complaints });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle block/unblock
exports.toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Citizen not found" });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      message: user.isBlocked ? "Citizen blocked" : "Citizen unblocked",
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete citizen
exports.deleteCitizen = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Citizen deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};