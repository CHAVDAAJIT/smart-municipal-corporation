const Document = require("../models/document");
const { createNotification } = require("./notificationController");
const { sendCertificateStatusEmail } = require("../utils/emailService");
const User = require("../models/user");

// Create request
exports.createRequest = async (req, res) => {
  try {
    const { type, data, address } = req.body;

    const files = req.files.map(file => file.path);

    const doc = await Document.create({
      user: req.user.id,
      type,
      data: JSON.parse(data),
      files,
      address,
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error creating request" });
  }
};

// Get user docs
exports.getUserDocs = async (req, res) => {
  const docs = await Document.find({ user: req.user.id });
  res.json(docs);
};

// Admin update


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");


   // ✅ In-app notification
    await createNotification(
      doc.user._id,
      `Certificate Request ${status}`,
      `Your ${doc.type} certificate request has been "${status}"`,
      "certificate",
      "/user/my-certificates"
    );

    // ✅ Email notification
    try {
      await sendCertificateStatusEmail(doc.user.email, doc.user.name, {
        type: doc.type,
        status,
        certId: doc._id.toString().slice(-6)
      });
    } catch (emailErr) {
      console.log("Email error:", emailErr.message);
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin - Get all document requests
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};