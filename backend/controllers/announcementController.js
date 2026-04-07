const Announcement = require("../models/announcement");
const User = require("../models/user");
const { sendAnnouncementEmail } = require("../utils/emailService");

// ===== USER =====
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===== ADMIN =====
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    // ✅ Save announcement
    const announcement = await Announcement.create({
      title, description, category, priority,
    });

    // ✅ Send email to ALL citizens (parallel, non-blocking)
    const users = await User.find({}, "email name");

    Promise.all(
      users.map((user) =>
        sendAnnouncementEmail(user.email, user.name, {
          title,
          message: description,   // emailService expects "message" field
          priority,
        })
      )
    ).catch((err) => console.error("Announcement email error:", err));

    res.status(201).json({
      message: "Announcement created & emails sent",
      announcement,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Updated", announcement });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    announcement.isActive = !announcement.isActive;
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};