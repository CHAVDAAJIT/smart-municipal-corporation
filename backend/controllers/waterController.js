const {
  Water,
  Schedule,
  Outage,
  BillInfo
} = require("../models/waterManagement");
const { createNotification } = require("./notificationController");
/* ===== USER ===== */

exports.createRequest = async (req, res) => {
  try {
    const { type, description, address, area } = req.body;
    if (!type || !description || !address || !area) {
      return res.status(400).json({ message: "All fields required" });
    }
    const request = await Water.create({
      user: req.user.id, type, description, address, area
    });
    res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Water.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Public info for citizens
exports.getPublicInfo = async (req, res) => {
  try {
    const schedule = await Schedule.find().sort({ createdAt: 1 });
    const outages = await Outage.find().sort({ createdAt: -1 });
    const bill = await BillInfo.findOne().sort({ createdAt: -1 });
    res.json({ schedule, outages, bill });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== ADMIN ===== */

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Water.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Water.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // ✅ Notification create karo
    await createNotification(
      request.user,
      "Water Request Updated",
      `Your ${request.type} request status changed to "${status}"`,
      "water",
      "/user/water"
    );

    res.json({ message: "Status updated", request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Schedule CRUD
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find().sort({ createdAt: 1 });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addSchedule = async (req, res) => {
  try {
    const { area, time } = req.body;
    const item = await Schedule.create({ area, time });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Outage CRUD
exports.getOutages = async (req, res) => {
  try {
    const outages = await Outage.find().sort({ createdAt: -1 });
    res.json(outages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addOutage = async (req, res) => {
  try {
    const { area, reason, time } = req.body;
    const outage = await Outage.create({ area, reason, time });
    res.status(201).json(outage);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleOutage = async (req, res) => {
  try {
    const outage = await Outage.findById(req.params.id);
    outage.resolved = !outage.resolved;
    await outage.save();
    res.json(outage);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOutage = async (req, res) => {
  try {
    await Outage.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Bill Info
exports.getBillInfo = async (req, res) => {
  try {
    const bill = await BillInfo.findOne().sort({ createdAt: -1 });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBillInfo = async (req, res) => {
  try {
    const { consumerId, month, unitsUsed, rate, dueDate } = req.body;
    let bill = await BillInfo.findOne();
    if (bill) {
      bill = await BillInfo.findByIdAndUpdate(
        bill._id,
        { consumerId, month, unitsUsed, rate, dueDate },
        { new: true }
      );
    } else {
      bill = await BillInfo.create({ consumerId, month, unitsUsed, rate, dueDate });
    }
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};