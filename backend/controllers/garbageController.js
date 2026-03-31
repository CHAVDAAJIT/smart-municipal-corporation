const { GarbageComplaint, GarbageTruck } = require("../models/garbage");
const { createNotification } = require("./notificationController");
/* ===== USER ===== */
exports.createComplaint = async (req, res) => {
  try {
    const { area, description, address } = req.body;
    if (!area || !description || !address) {
      return res.status(400).json({ message: "All fields required" });
    }
    const complaint = await GarbageComplaint.create({
      user: req.user.id, area, description, address
    });
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await GarbageComplaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTrucks = async (req, res) => {
  try {
    const trucks = await GarbageTruck.find();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== ADMIN ===== */
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await GarbageComplaint.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await GarbageComplaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // ✅ Notification create karo
    await createNotification(
      complaint.user,
      "Garbage Complaint Updated",
      `Your garbage complaint status changed to "${status}"`,
      "garbage",
      "/user/garbage"
    );

    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTrucks = async (req, res) => {
  try {
    const trucks = await GarbageTruck.find();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTruckStatus = async (req, res) => {
  try {
    const { status, lat, lng } = req.body;
    const truck = await GarbageTruck.findByIdAndUpdate(
      req.params.id,
      { status, lat, lng },
      { new: true }
    );
    res.json({ message: "Truck updated", truck });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addTruck = async (req, res) => {
  try {
    const { truckId, driverName, area, status, lat, lng } = req.body;
    const truck = await GarbageTruck.create({
      truckId, driverName, area, status, lat, lng
    });
    res.status(201).json({ message: "Truck added", truck });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};