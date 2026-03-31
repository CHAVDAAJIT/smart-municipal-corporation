const CityUpdate = require("../models/cityUpdate");

/* ===== USER ===== */
exports.getUpdates = async (req, res) => {
  try {
    const updates = await CityUpdate.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== ADMIN ===== */
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
    const { title, description, category, image } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }
    const update = await CityUpdate.create({
      title, description, category, image
    });
    res.status(201).json({ message: "Update created", update });
  } catch (err) {
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