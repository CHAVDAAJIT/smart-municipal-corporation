const Document = require("../models/document");

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
  const { status } = req.body;

  const doc = await Document.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(doc);
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