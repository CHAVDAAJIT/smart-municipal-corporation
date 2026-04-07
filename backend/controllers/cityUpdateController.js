const CityUpdate = require("../models/cityUpdate");
const User = require("../models/user");
const { sendCityUpdateEmail } = require("../utils/emailService");

exports.getUpdates = async (req, res) => {
  try {
    const updates = await CityUpdate.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUpdates = async (req, res) => {
  try {
    const updates = await CityUpdate.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUpdate = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    // ✅ Save update
    const update = await CityUpdate.create({ title, description, category });

    // ✅ Send email to ALL citizens (parallel, non-blocking)
    const users = await User.find({}, "email name");

    Promise.all(
      users.map((user) =>
        sendCityUpdateEmail(user.email, user.name, { title, description })
      )
    ).catch((err) => console.error("City update email error:", err));

    res.status(201).json({
      message: "Update created & emails sent",
      update,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const update = await CityUpdate.findById(req.params.id);
    update.isActive = !update.isActive;
    await update.save();
    res.json(update);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    await CityUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};